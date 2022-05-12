var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
const validate = require("../Validation/SatuanValidation");
router.get("/", async function (req, res, next) {
  const { timestamp = false } = req.query;
  let result = [];
  if (timestamp) {
    result = await koneksi.query(
      "select * from tblsatuan where (created_at > $2 or updated_at > $2) and idtoko=$1",
      [req.context.idtoko, timestamp]
    );
  } else {
    result = await koneksi.query("select * from tblsatuan where idtoko=$1", [
      req.context.idtoko,
    ]);
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
    "select * from tblsatuan where idsatuan = $1",
    [id]
  );

  if (result) {
    res.status(200).json({
      status: true,
      data: result,
    });
  } else {
    res.status(304).json({
      status: false,
      data: {},
      message: "Data tidak ditemukan",
    });
  }
  //
});

router.post("/", validate(), handlerInput, function (req, res, next) {
  let sql = `INSERT INTO tblsatuan (nama_satuan, idtoko) VALUES ($1,$2) returning *`;
  let data = [req.body.nama_satuan, req.context.idtoko];

  koneksi
    .oneOrNone(sql, data)
    .then((result) => {
      res.status(200).json({
        status: true,
        data: result,
      });
    })
    .catch((e) => {
      res.status(304).json({
        status: false,
        data: {},
        message: e.message,
      });
    });
});

router.post("/:id", validate(), handlerInput, function (req, res) {
  let idsatuan = req.params.id;
  let sql = `UPDATE tblsatuan SET nama_satuan=$1, idtoko=$2 WHERE idsatuan=$3 returning *`;
  let data = [req.body.nama_satuan, req.context.idtoko, idsatuan];
  koneksi
    .oneOrNone(sql, data)
    .then((result) => {
      res.status(200).json({
        status: true,
        data: result,
      });
    })
    .catch((e) => {
      res.status(304).json({
        status: false,
        data: {},
        message: e.message,
      });
    });
});

router.delete("/:id", async function (req, res, next) {
  let id = req.params.id;
  let sql = `DELETE FROM tblsatuan WHERE idsatuan=$1 returning *`;
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
      res.status(304).json({
        status: false,
        data: {},
        message: err.message,
      });
    });
});
module.exports = router;
