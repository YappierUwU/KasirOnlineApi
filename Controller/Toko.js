var express = require("express");
var koneksi = require("../Util/Database");
const router = require("express").Router();

router.get("identitas", async function(req, res) {
    let sql = "select * from tbltoko where idtoko=$1";
    let data = await koneksi.oneOrNone(sql, [req.context.idtoko]);
    res.status(200).json({
        status: true,
        data: data,
    });
});

// update identitas nama, alamat, lokasi, jenis usaha
router.post("/identitas", async function(req, res) {
    let sql =
        "update tbltoko set nama_toko=$1, alamat_toko=$2, lokasi_toko=$3, jenis_toko=$4 where idtoko=$5";
    let data = await koneksi.none(sql, [
        req.body.nama_toko,
        req.body.alamat_toko,
        req.body.lokasi_toko,
        req.body.jenis_toko,
        req.context.idtoko,
    ]);
    res.status(200).json({
        status: true,
        data: data,
    });
});
module.exports = router;