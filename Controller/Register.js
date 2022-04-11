var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const { generate } = require("../Util/JWT");
const { encrypt } = require("../Util/Encrypt");
const validate = require("../Validation/UserValidation");
const handlerInput = require("../Util/ValidationHandler");
// twlp
// nama pemilik nama usaha lokasui usaha jenis usaha
router.post("/minta", async function (req, res) {
  let sql = "update tbltoko set nomer_toko=$1  where idtoko=$2";
  koneksi.none(sql, [req.body.nomer_toko, req.context.idtoko]);
  let data = [req.body.nomer_toko, req.context.idtoko];
  let token = 1234;
  res.status(200).json({
    status: true,
    token: token,
  });
});

router.post("/profile", async function (req, res, next) {
  let sql = `UPDATE tbltoko set nama_toko=$1, alamat_toko=$2, nama_pemilik=$3, jenis_toko=$4 where idtoko=$5 `;
  let data = [
    req.body.nama_toko,
    req.body.alamat_toko,
    req.body.nama_pemilik,
    req.body.jenis_toko,
    req.context.idtoko,
  ];
  koneksi.none(sql, data);
  res.json({
    message: "data berhasil diubah",
  });
  //
});

module.exports = router;
