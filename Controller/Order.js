var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");

router.post("/", handlerInput, async function (req, res, next) {
  let id = `select idjual from tbljual order by idjual desc limit 1`;
  let { idjual } = await koneksi.oneOrNone(id);
  console.log(idjual);
  if (!idjual) {
    idjual = 0;
  }
  idjual++;
  let format = "00000000";
  let faktur =
    format.substring(0, 8 - idjual.toString().length) + idjual.toString();
  console.log(req.body);
  console.log(req.context);
  let sql = `INSERT INTO tbljual (fakturjual,bayar,total,kembali,potongan,idpelanggan,idpegawai, idtoko) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) returning *`;
  let data = [faktur, 0, 0, 0, 0, null, req.body.idpegawai, req.context.idtoko];

  koneksi
    .any(sql, data)
    .then((data) => {
      res.status(200).json({
        status: true,
        data: data,
      });
    })
    .catch((e) => {
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
