var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
const validate = require("../Validation/DetailValidation");

router.get("/", async function(req, res, next) {
    const { timestamp = false } = req.query;
    let sql,
        result = [];
    if (timestamp) {
        sql =
            "select * from tbldetailjual where created_at > $1 or updated_at > $1";
        result = await koneksi.query(sql, [timestamp]);
    } else {
        sql = "select * from tbldetailjual where idtoko=$1 ";
        result = await koneksi.query(sql, [req.context.idtoko]);
    }

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

router.post("/", validate(), handlerInput, async function(req, res, next) {
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
            res.status(400).json({
                status: false,
            });
        });

    //
});

router.delete(
    "/:id",
    async function(req, res, next) {
        let id = req.params.id;
        let sql = `DELETE FROM tbldetailjual WHERE iddetailjual=$1`;
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