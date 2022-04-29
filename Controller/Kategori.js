var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
router.get("/", async function(req, res, next) {
    let result = await koneksi.query(
        "select * from tblkategori where idtoko=$1", [req.context.idtoko]
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

router.get("/:id", async function(req, res, next) {
    let id = req.params.id;
    let result = await koneksi.oneOrNone(
        "select * from tblkategori where idkategori = $1", [id]
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
            res.status(500).json({
                status: false,
                data: {},
                message: err.message,
            });
        });
});

router.post("/:id", handlerInput, function(req, res) {
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
            res.status(500).json({
                status: false,
                data: {},
                message: e.message,
            });
        });
});

router.delete("/:id", async function(req, res, next) {
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
            res.status(500).json({
                status: false,
                data: {},
                message: err.message,
            });
        });
});
module.exports = router;