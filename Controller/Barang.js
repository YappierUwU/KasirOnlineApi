var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
router.get("/", async function(req, res, next) {
    const { cari = "" } = req.query;
    let result = await koneksi.query(
        "select * from tblbarang where barang ILIKE '%" + cari + "%'", [cari]
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
    let result = await koneksi.query(
        "select * from tblbarang where idbarang = $1", [id]
    );

    if (result.length == 1) {
        res.status(200).json({
            status: true,
            data: result[0],
        });
    } else {
        res.status(304).json({
            status: false,
            data: [],
        });
    }
    //
});

router.post("/", handlerInput, function(req, res, next) {
    if (!req.body.flag_stok || req.body.flag_stok == "0") {
        req.body.flag_stok = 0;
        req.body.stok = 0;
    } else {
        req.body.flag_stok = 1;
    }

    let sql = `INSERT INTO tblbarang (idbarang,idkategori,idsatuan,barang,harga,hargabeli, idtoko,stok,flag_stok) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
    let data = [
        req.body.idbarang,
        req.body.idkategori,
        req.body.idsatuan,
        req.body.barang,
        req.body.harga,
        req.body.hargabeli,
        req.body.idtoko,
        req.body.stok,
        req.body.flag_stok,
    ];

    koneksi.any(sql, data);
    res.status(200).json({
        status: true,
        data: req.body,
    });

    //
});

router.post("/:id", handlerInput, function(req, res) {
    let idbarang = req.params.id;
    let sql = `UPDATE tblbarang set idkategori=$1,idsatuan=$2,barang=$3,harga=$4,hargabeli=$5, idtoko=$6 where idbarang=$7`;
    let data = [
        req.body.idkategori,
        req.body.idsatuan,
        req.body.barang,
        req.body.harga,
        req.body.hargabeli,
        req.body.idtoko,
        idbarang,
    ];
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
    async function(req, res, next) {
        let id = req.params.id;
        let sql = `DELETE FROM tblbarang WHERE idbarang=$1`;
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