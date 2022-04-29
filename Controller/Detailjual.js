var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");

router.post("/", handlerInput, async function (req, res, next) {
  console.log(req.body);
  console.log(req.context);
  let sql = `INSERT INTO tbldetailjual (idjual,idbarang,jumlahjual,hargajual,idtoko) VALUES ($1,$2,$3,$4,$5) `;
  let data = [
    req.body.idjual,
    req.body.idbarang,
    req.body.jumlahjual,
    req.body.hargajual,
    req.context.idtoko,
  ];

  koneksi
    .any(sql, data)
    .then((data) => {
      res.status(200).json({
        status: true,
        data: req.body,
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(304).json({
        status: false,
      });
    });

  //
});

router.delete(
  "/:id",
  async function (req, res, next) {
    let id = req.params.id;
    let sql = `DELETE FROM tbldetailjual WHERE iddetailjual=$1`;
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