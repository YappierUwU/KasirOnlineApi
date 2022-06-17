var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const { generate } = require("../Util/JWT");
const { encrypt } = require("../Util/Encrypt");
const validate = require("../Validation/UserValidation");
const handlerInput = require("../Util/ValidationHandler");
// twlp
// nama pemilik nama usaha lokasui usaha jenis usaha
router.post("/register", validate(), handlerInput, async function(req, res) {
    let sql = `INSERT INTO tbltoko (nama_toko, alamat_toko, nomer_toko, nama_pemilik, email_toko, password_toko, jenis_toko) VALUES ( NULL, NULL, NULL, NULL, $5, $6 , NULL ) returning idtoko`;
    let data = [
        "-",
        "-",
        "-",
        "-",
        req.body.email,
        encrypt(req.body.password),
        "-",
    ];
    const toko = await koneksi.oneOrNone(sql, data);
    let token = generate(toko.idtoko, "2");
    res.status(200).json({
        status: true,
        data: {
            email: req.body.email,
        },
        token: token,
    });
});

router.post("/login", async function(req, res, next) {
    let sql = `SELECT nomer_toko, nama_toko,nama_pemilik,idtoko,email_toko FROM tbltoko where email_toko=$1 and password_toko=$2`;
    let sqlOTP = "select idotp from tblotp where idtoko=$1;";

    let data = [req.body.email, encrypt(req.body.password)];
    let result = await koneksi.any(sql, data);

    if (result.length > 0) {
        let otp = await koneksi.any(sqlOTP, [result[0].idtoko]);

        let { nomer_toko, nama_toko } = result[0];
        let page = "Dashboard";
        if (!nomer_toko || otp.length > 0) {
            page = "Verifikasi OTP";
        } else if (nomer_toko && !nama_toko) {
            page = "Ubah Data Toko";
        }

        let token = generate(result[0].idtoko, "2");
        res.json({
            token: token,
            page: page,
            data: {
                username: result[0].nama_pemilik,
                email: result[0].email_toko,
            },
        });
    } else {
        res
            .status(400)
            .json({ status: false, message: "Email atau Password tidak ditemukan" });
    }
});

module.exports = router;