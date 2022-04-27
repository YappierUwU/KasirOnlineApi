var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");

router.get("/", async function (req, res, next) {
  const { cari = "" } = req.query;
  let result = await koneksi.query(
    "select * from tblpegawai where nama_pegawai ILIKE '%" + cari + "%'",
    [cari]
  );
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
    "select * from tblpegawai where idpegawai = $1",
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
  let sql = `INSERT INTO tblpegawai (nama_pegawai, alamat_pegawai,no_pegawai,pin, idtoko) VALUES ($1,$2,$3,$4,$5)`;
  let data = [
    req.body.nama_pegawai,
    req.body.alamat_pegawai,
    req.body.no_pegawai,
    req.body.pin,
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
    let sql = `DELETE FROM tblpegawai WHERE idpegawai=$1`;
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

router.post("/login", async function (req, res, next) {
  let sql = `SELECT * FROM tblpegawai where idpegawai=$1 and pin=$2`;
  let data = [req.body.idpegawai, req.body.pin];
  let result = await koneksi.any(sql, data);
  if (result.length > 0) {
    res.json({
      data: {
        message: "login berhasil",
        status: true,
        data: result[0],
      },
    });
  } else {
    res.status(404).json({ msg: "Id Pegawai dan Pin salah" });
  }
});

router.post("/:id", handlerInput, function (req, res) {
  console.log(req.body);
  console.log(req.context);
  let idpegawai = req.params.id;
  let sql = `UPDATE tblpegawai SET nama_pegawai=$1,alamat_pegawai=$2,no_pegawai=$3,pin=$4,idtoko=$5 WHERE idpegawai=$6 `;
  let data = [
    req.body.nama_pegawai,
    req.body.alamat_pegawai,
    req.body.no_pegawai,
    req.body.pin,
    req.body.idtoko,
    idpegawai,
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
module.exports = router;
