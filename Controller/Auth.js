var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const { generate } = require("../Util/JWT");
const { encrypt } = require("../Util/Encrypt");
const validate = require("../Validation/UserValidation");
const registValidate = require("../Validation/RegisterValidation");
const handlerInput = require("../Util/ValidationHandler");
const { addRow, updateRow } = require("../Util/Sheet");

function generateToken() {
    let digit1 = Math.floor(Math.random() * 9).toString();
    let digit2 = Math.floor(Math.random() * 9).toString();
    let digit3 = Math.floor(Math.random() * 9).toString();
    let digit4 = Math.floor(Math.random() * 9).toString();
    return digit1 + digit2 + digit3 + digit4;
}
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

router.post(
    "/register/v2",
    registValidate(),
    handlerInput,
    async function(req, res) {
        let sql = `INSERT INTO tbltoko (nama_toko, alamat_toko, nomer_toko, nama_pemilik, email_toko, password_toko, jenis_toko) VALUES ( NULL, NULL, $3, NULL, $5, $6 , NULL ) returning idtoko`;
        let data = [
            "-",
            "-",
            req.body.nomer_toko,
            "-",
            req.body.email,
            encrypt(req.body.password),
            "-",
        ];

        const toko = await koneksi.oneOrNone(sql, data);

        let email = req.body.email;
        let otp =
            "insert into tblotp (idtoko,otp,created_at,status) values ($1,$2,$3,$4)";
        let timer =
            "set TIMEZONE = 'Asia/Jakarta' ; select created_at , now() - interval '5 minutes' from tblotp where idtoko=$1 and created_at >= now() - interval '5 minutes' order by created_at desc limit 1";
        let waktu = await koneksi.oneOrNone(timer, [
            toko.idtoko,
            req.body.nomer_toko,
        ]);
        let token = generateToken();
        token = token.toString();
        const created_at = new Date();
        let isi = [toko.idtoko, token, created_at, 0];
        if (waktu) {
            res.status(400).json({
                status: false,
                message: "Verifikasi gagal telah dilakukan harap tunggu 5 menit lagi",
            });
            return;
        }
        koneksi.none(otp, isi, timer, [req.body.created_at]);
        let message =
            "TERIMA KASIH TELAH MENDAFTAR DI APLIKASI KAMI , JANGAN BERIKAN KODE INI PADA SIAPAPUN " +
            token;

        client
            .sendMessage(req.body.nomer_toko + "@c.us", message)
            .then(async(response) => {
                await addRow({
                    idtoko: toko.idtoko,
                    nomer_toko: req.body.nomer_toko,
                    nama_toko: "",
                    alamat_toko: "",
                    nama_pemilik: "",
                    email_toko: email ? email.email_toko : "",
                });

                let token = generate(toko.idtoko, "2");
                res.status(200).json({
                    status: true,
                    data: {
                        email: req.body.email,
                    },
                    token: token,
                });
            })
            .catch((e) => {
                console.log(e);
                res.status(400).json({
                    status: false,
                    message: "Terjadi Kesalahan harap coba lagi",
                });
            });
    }
);

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