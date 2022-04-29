var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
router.get("/", async function (req, res, next) {
  let result = await koneksi.query("select * from tblsatuan");
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

router.get("/t", async function (req, res, next) {
  const { cari = "", timestamp = false } = req.query;
  let sql;
  if (timestamp) {
    sql = "select * from tblsatuan where created_at > $1 or updated_at > $1";
  }
  let result = await koneksi.query(sql, [timestamp]);
  if (result.length > 0) {
    res.status(200).json({
      status: true,
      data: result,
    });
  } else {
    res.status(400).json({
      status: false,
      data: [],
    });
  }
});

router.get("/:id", async function (req, res, next) {
  let id = req.params.id;
  let result = await koneksi.query(
    "select * from tblsatuan where idsatuan = $1",
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
  let sql = `INSERT INTO tblsatuan (nama_satuan, idtoko) VALUES ($1,$2)`;
  let data = [req.body.nama_satuan, req.context.idtoko];

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
  let idsatuan = req.params.id;
  let sql = `UPDATE tblsatuan SET nama_satuan=$1, idtoko=$2 WHERE idsatuan=$3 `;
  let data = [req.body.nama_satuan, req.context.idtoko, idsatuan];
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
    let sql = `DELETE FROM tblsatuan WHERE idsatuan=$1`;
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
