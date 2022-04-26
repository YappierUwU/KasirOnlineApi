var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");

router.post("/", handlerInput, function (req, res, next) {
  console.log(req.body);
  console.log(req.context);
  let sql = `INSERT INTO tbljual (fakturjual, bayar,total,kembali,potongan,idpelanggan,idpegawai, idtoko) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
  let data = [
    req.body.fakturjual,
    req.body.bayar,
    req.body.total,
    req.body.kembali,
    req.body.potongan,
    req.body.idpelanggan,
    req.body.idpegawai,
    req.context.idtoko,
  ];

  koneksi.any(sql, data);
  res.status(200).json({
    status: true,
    data: req.body,
  });

  //
});

router.delete(
  "/:id",
  async function (req, res, next) {
    let id = req.params.id;
    let sql = `DELETE FROM tbljual WHERE idjual=$1`;
    let data = [id];

    koneksi.any(sql, data);
    return res.status(200).json({
      status: true,
      data: "data telah dihapus",
    });
    return res.status(304).json({
      status: false,
      data: [],
    });
  }
  //
);

module.exports = router;
