var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
const validate = require("../Validation/DoctorValidation");

router.get("/", async function (req, res, next) {
  let result = await koneksi.query("select * from tblbarang");
  if (result.length > 0) {
    res.status(200).json({
      status: true,
      data: result,
    });
  } else {
    res.status(200).json({
      status: true,
      data: [],
    });
  }
  //
});

router.get("/:id", async function (req, res, next) {
  let id = req.params.id;
  let result = await koneksi.query(
    "select * from tblbarang where idbarang = $1",
    [id]
  );

  if (result.length == 1) {
    res.status(200).json({
      status: true,
      data: result[0],
    });
  } else {
    res.status(304).json({
      status: false,
      data: [],
    });
  }
  //
});

router.post("/", handlerInput, function (req, res, next) {
  console.log(req.body);
  console.log(req.context);
  let sql = `INSERT INTO tblbarang (idkategori,idsatuan,barang,harga,hargabeli, idtoko) VALUES ($1,$2,$3,$4,$5,$6)`;
  let data = [
    req.body.idkategori,
    req.body.idsatuan,
    req.body.barang,
    req.body.harga,
    req.body.hargabeli,
    req.body.idtoko,
  ];

  koneksi.any(sql, data);
  res.status(200).json({
    status: true,
    data: req.body,
  });

  //
});

router.post("/:id", handlerInput, function (req, res) {
  console.log(req.body);
  console.log(req.context);
  let idkategori = req.params.id;
  let sql = `UPDATE tblkategori SET nama_kategori=$1, idtoko=$2 WHERE idkategori=$3 `;
  let data = [req.body.nama_kategori, req.body.idtoko, idkategori];
  koneksi.oneOrNone(sql, data).catch((e) => {
    console.log(e);
  });

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
    let sql = `DELETE FROM tblkategori WHERE idkategori=$1`;
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
