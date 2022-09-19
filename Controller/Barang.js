var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
const validate = require("../Validation/BarangValidation");
const updateValidate = require("../Validation/UpdateBarangValidation");

router.get("/", async function(req, res, next) {
    const { cari = "", timestamp = false } = req.query;
    let sql;
    if (timestamp) {
        sql =
            "select * from tblbarang where (created_at > $1 or updated_at > $1) and idtoko=$2";
    } else {
        sql =
            "select * from view_barang where barang ILIKE '%" +
            cari +
            "%' and idtoko=$2";
    }
    let result = await koneksi.query(sql, [timestamp, req.context.idtoko]);
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
        "select * from tblbarang where idbarang = $1 and idtoko=$2", [id, req.context.idtoko]
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
});

router.post("/", validate(), handlerInput, function(req, res, next) {
    if (!req.body.flag_stok || req.body.flag_stok == "0") {
        req.body.flag_stok = 0;
        req.body.stok = 0;
    } else {
        req.body.flag_stok = 1;
    }

    let sql = `INSERT INTO tblbarang (idbarang,idkategori,idsatuan,barang,harga,hargabeli, idtoko,stok,flag_stok) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *`;
    let data = [
        req.body.idbarang,
        req.body.idkategori,
        req.body.idsatuan,
        req.body.barang,
        req.body.harga,
        req.body.hargabeli,
        req.context.idtoko,
        req.body.stok,
        req.body.flag_stok,
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
            res.status(400).json({
                status: false,
                data: {},
                message: e.message,
            });
        });
});

router.post("/:id", updateValidate(), handlerInput, function(req, res) {
    let idbarang = req.params.id;
    let sql = `UPDATE tblbarang set idkategori=$1,idsatuan=$2,barang=$3,harga=$4,hargabeli=$5, idtoko=$6 where idbarang=$7 returning *`;
    let data = [
        req.body.idkategori,
        req.body.idsatuan,
        req.body.barang,
        req.body.harga,
        req.body.hargabeli,
        req.context.idtoko,
        idbarang,
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
            res.status(400).json({
                status: false,
                data: {},
                message: e.message,
            });
        });
});

router.delete("/:id", async function(req, res, next) {
    let id = req.params.id;
    let sql = `DELETE FROM tblbarang WHERE idbarang=$1 and idtoko=$2 returning *`;
    let data = [id, req.context.idtoko];

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
module.exports = router;