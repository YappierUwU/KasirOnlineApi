var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
const validate = require("../Validation/OrderValidation");

router.get("/", async function(req, res, next) {
    const { timestamp = "" } = req.query;
    let sql,
        result = [];
    if (timestamp) {
        sql = "select * from tbljual where created_at > $1 or updated_at > $1";
        result = await koneksi.query(sql, [timestamp]);
    } else {
        sql = "select * from tbljual where idtoko=$1 ";
        result = await koneksi.query(sql, [req.context.idtoko]);
    }
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

router.post("/v2", handlerInput, async function(req, res, next) {
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
            res.status(400).json({
                status: false,
            });
        });

    //
});

router.get("/faktur", async function(req, res, next) {
    let id = `select idjual from tbljual where idtoko=$1 order by idjual desc limit 1`;
    let data = await koneksi.oneOrNone(id, [req.context.idtoko]);
    if (!data) {
        idjual = 0;
    } else {
        idjual = data.idjual;
    }
    idjual++;
    let format = "00000000";
    let faktur =
        format.substring(0, 8 - idjual.toString().length) + idjual.toString();
    res.json({
        status: true,
        faktur,
    });
});

router.get("/detail/:id", async function(req, res, next) {
    let sql = `select * from view_detailjual where idjual=$1`;
    let data = await koneksi.query(sql, [req.params.id]);
    if (data) {
        res.status(200).json({
            status: true,
            data,
        });
    } else {
        res.status(400).json({
            status: false,
        });
    }
});

router.post("/", validate(), handlerInput, async function(req, res, next) {
    if (req.body.idpelanggan.toString() == "0") {
        req.body.idpelanggan = null;
        console.log(null);
    }
    let id = `select idjual from tbljual where idtoko=$1 order by idjual desc limit 1`;
    let data = await koneksi.oneOrNone(id, [req.context.idtoko]);
    if (!data) {
        idjual = 0;
    } else {
        idjual = data.idjual;
    }
    idjual++;
    let format = "00000000";
    let faktur =
        format.substring(0, 8 - idjual.toString().length) + idjual.toString();
    let datajual = `insert into tbljual (fakturjual,bayar,total,kembali,potongan,idpelanggan,idpegawai,idtoko,tanggal_jual) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *`;
    koneksi
        .oneOrNone(datajual, [
            faktur,
            req.body.bayar,
            req.body.total,
            req.body.kembali,
            req.body.potongan,
            req.body.idpelanggan,
            req.body.idpegawai,
            req.context.idtoko,
            req.body.tanggal_jual,
        ])
        .then(async(data) => {
            const idjual = data.idjual;
            const detail = req.body.detail;
            let idprodukerror = null;
            try {
                for (item of detail) {
                    let sql = `INSERT INTO tbldetailjual (idjual,idbarang,jumlahjual,hargajual,idtoko) VALUES ($1,$2,$3,$4,$5) `;
                    let data = [
                        idjual,
                        item.idbarang,
                        item.jumlahjual,
                        item.hargajual,
                        req.context.idtoko,
                    ];
                    await koneksi.none(sql, data);
                }
            } catch (error) {
                console.log(error);
                await koneksi.none(
                    "delete from tbldetailjual where idjual=$1; delete from tbljual where idjual=$1 ", [idjual]
                );
                idprodukerror = item.idbarang;
            }
            if (idprodukerror) {
                console.log("produk tidak ada");
                res.status(400).json({
                    status: false,
                    message: idprodukerror + " tidak ditemukan",
                });
                return;
            }

            const dataSaved = await koneksi.query(
                "select * from view_detailjual where idjual=$1", [idjual]
            );

            data.detail = dataSaved;
            return res.status(200).json({
                status: true,
                message: "sukses",
                data,
            });
        })
        .catch(() => {
            return res.status(400).json({
                status: false,
                message: "terjadi kesalahan",
            });
        });
});

router.delete(
    "/:id",
    async function(req, res, next) {
        let id = req.params.id;
        let sql = `DELETE FROM tbljual WHERE idjual=$1`;
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