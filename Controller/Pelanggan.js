var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");

router.get("/", async function(req, res, next) {
    const { cari = "" } = req.query;
    let result = await koneksi.query(
        "select * from tblpelanggan where nama_pelanggan ILIKE '%" +
        cari +
        "%' and idtoko=$2", [cari, req.context.idtoko]
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
});

router.get("/:id", async function(req, res, next) {
    let id = req.params.id;
    let result = await koneksi.oneOrNone(
        "select * from tblpelanggan where idpelanggan = $1", [id]
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

router.post("/", handlerInput, function(req, res, next) {
    let sql = `INSERT INTO tblpelanggan (nama_pelanggan, alamat_pelanggan,no_telepon , idtoko) VALUES ($1,$2,$3,$4) returning *`;
    let data = [
        req.body.nama_pelanggan,
        req.body.alamat_pelanggan,
        req.body.no_telepon,
        req.context.idtoko,
    ];
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

    //
});

router.post("/:id", handlerInput, function(req, res) {
    let idpelanggan = req.params.id;
    let sql = `UPDATE tblpelanggan SET nama_pelanggan=$1,alamat_pelanggan=$2,no_telepon=$3,idtoko=$4 WHERE idpelanggan=$5 returning *`;
    let data = [
        req.body.nama_pelanggan,
        req.body.alamat_pelanggan,
        req.body.no_telepon,
        req.context.idtoko,
        idpelanggan,
    ];
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

router.delete("/:id", async function(req, res, next) {
    let id = req.params.id;
    let sql = `DELETE FROM tblpelanggan WHERE idpelanggan=$1 returning *`;
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