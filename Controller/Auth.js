var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const { generate } = require("../Util/JWT");
const { encrypt } = require("../Util/Encrypt");
const validate = require("../Validation/UserValidation");
const handlerInput = require("../Util/ValidationHandler");
// twlp
// nama pemilik nama usaha lokasui usaha jenis usaha
router.post("/register", validate(), handlerInput, async function (req, res) {
  let sql = `INSERT INTO tbltoko (nama_toko, alamat_toko, nomer_toko, nama_pemilik, email_toko, password_toko, jenis_toko) VALUES ( $1, $2, $3, $4, $5, $6 , $7 ) returning idtoko`;
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
    data: req.body,
    token: token,
  });
});

router.post("/login", async function (req, res, next) {
  let sql = `SELECT * FROM tbltoko where email_toko=$1 and password_toko=$2`;
  let data = [req.body.email, encrypt(req.body.password)];
  let result = await koneksi.any(sql, data);
  if (result.length > 0) {
    let token = generate(result[0].idtoko, "2");
    res.json({
      token: token,
      data: {
        email: result[0].email_toko,
      },
    });
  } else {
    res.status(404).json({ msg: "Email atau Password tidak ditemukan" });
  }
  //
});

module.exports = router;
