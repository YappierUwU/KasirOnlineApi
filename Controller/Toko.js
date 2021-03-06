var express = require("express");
var koneksi = require("../Util/Database");
const router = require("express").Router();

router.get("/identitas", async function(req, res) {
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
        "update tbltoko set nama_toko=$1, alamat_toko=$2, jenis_toko=$3, nama_pemilik=$4 where idtoko=$5";
    koneksi
        .none(sql, [
            req.body.nama_toko,
            req.body.alamat_toko,
            req.body.jenis_toko,
            req.body.nama_pemilik,
            req.context.idtoko,
        ])
        .then(() => {
            res.status(200).json({
                status: true,
                message: "Data berhasil diubah",
            });
        })
        .catch((err) => {
            res.status(500).json({
                status: false,
                message: "Data gagal diubah" + err,
            });
        });
});
module.exports = router;