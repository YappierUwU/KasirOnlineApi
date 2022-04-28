var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");

router.get("/", async function (req, res, next) {
  const { cari = "", timestamp = false } = req.query;
  let sql;
  if (timestamp) {
    sql = "select * from tblpelanggan where created_at > $1 or updated_at > $1";
  } else {
    sql =
      "select * from view_pelanggan where nama_pelanggan ILIKE '%" +
      cari +
      "%'";
  }
  let result = await koneksi.query(sql, [timestamp]);
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
    "select * from tblpelanggan where idpelanggan = $1",
    [id]
  );

  if (result.length == 1) {
    res.status(200).json({
      status: true,
      data: result[0],
    });
  } else {
    res.status(400).json({
      status: false,
      data: [],
    });
  }
  //
});

router.post("/", handlerInput, function (req, res, next) {
  console.log(req.body);
  console.log(req.context);
  let sql = `INSERT INTO tblpelanggan (nama_pelanggan, alamat_pelanggan,no_telepon , idtoko) VALUES ($1,$2,$3,$4)`;
  let data = [
    req.body.nama_pelanggan,
    req.body.alamat_pelanggan,
    req.body.no_telepon,
    req.context.idtoko,
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
  let idpelanggan = req.params.id;
  let sql = `UPDATE tblpelanggan SET nama_pelanggan=$1,alamat_pelanggan=$2,no_telepon=$3,idtoko=$4 WHERE idpelanggan=$5 `;
  let data = [
    req.body.nama_pelanggan,
    req.body.alamat_pelanggan,
    req.body.no_telepon,
    req.context.idtoko,
    idpelanggan,
  ];
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
    let sql = `DELETE FROM tblpelanggan WHERE idpelanggan=$1`;
    let data = [id];

    koneksi.any(sql, data);
    return res.status(200).json({
      status: true,
      data: "data telah dihapus",
    });
    return res.status(400).json({
      status: false,
      data: [],
    });
  }
  //
);
module.exports = router;
