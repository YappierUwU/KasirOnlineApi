var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
const validate = require("../Validation/KategoriValidation");
router.get("/", async function (req, res, next) {
  const { timestamp = false } = req.query;
  let sql,
    result = [];
  if (timestamp) {
    sql =
      "select * from tblkategori where idtoko=$1 and (created_at > $2 or updated_at > $2) order by nama_kategori";
    result = await koneksi.query(sql, [req.context.idtoko, timestamp]);
  } else {
    sql = "select * from tblkategori where idtoko=$1 order by nama_kategori";
    result = await koneksi.query(sql, [req.context.idtoko]);
  }

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
  let result = await koneksi.oneOrNone(
    "select * from tblkategori where idkategori = $1 and idtoko=$2",
    [id, req.context.idtoko]
  );

  if (result) {
    res.status(200).json({
      status: true,
      data: result,
    });
  } else {
    res.status(400).json({
      status: false,
      data: {},
      message: "Data tidak ditemukan",
    });
  }
  //
});

router.post("/", validate(), handlerInput, function (req, res, next) {
  let sql = `INSERT INTO tblkategori (nama_kategori, idtoko) VALUES ($1,$2) returning *`;
  let data = [req.body.nama_kategori, req.context.idtoko];

  koneksi
    .oneOrNone(sql, data)
    .then((result) => {
      res.status(200).json({
        status: true,
        data: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: false,
        data: {},
        message: err.message,
      });
    });
});

router.post("/:id", validate(), handlerInput, function (req, res) {
  let idkategori = req.params.id;
  let sql = `UPDATE tblkategori SET nama_kategori=$1, idtoko=$2 WHERE idkategori=$3 returning *`;
  let data = [req.body.nama_kategori, req.context.idtoko, idkategori];
  koneksi
    .oneOrNone(sql, data)
    .then((result) => {
      res.status(200).json({
        status: true,
        data: result,
      });
    })
    .catch((e) => {
      res.status(400).json({
        status: false,
        data: {},
        message: e.message,
      });
    });
});

router.delete("/:id", async function (req, res, next) {
  let id = req.params.id;
  let sql = `DELETE FROM tblkategori WHERE idkategori=$1 returning *`;
  let data = [id];

  koneksi
    .oneOrNone(sql, data)
    .then((result) => {
      res.status(200).json({
        status: true,
        data: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: false,
        data: {},
        message: err.message,
      });
    });
});
module.exports = router;
