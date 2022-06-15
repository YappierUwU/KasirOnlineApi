var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");

router.get("/laba", async function(req, res, next) {
    let { cari = "", mulai = "", sampai = "" } = req.query;
    let sql;
    let sqlFilterTanggal = "";
    if (mulai != "" && sampai != "") {
        sampai = sampai + " 23:59";
        sqlFilterTanggal = "and tanggal_jual between $2 and $3";
    }
    sqlFilterTanggal = sqlFilterTanggal + " and idtoko = " + req.context.idtoko;
    sql =
        "select fakturjual,nama_pelanggan,nama_pegawai,tanggal_jual,barang,jumlahjual,nama_satuan,hargabeli,hargajual,idtoko,hargajual-hargabeli as laba from view_detailjual where (nama_pelanggan ILIKE '%" +
        cari +
        "%' or fakturjual ILIKE '%" +
        cari +
        "%')  " +
        sqlFilterTanggal;

    let result = await koneksi.query(sql, [cari, mulai, sampai]);
    console.log(result);
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

router.get("/pendapatan", async function(req, res, next) {
    let { cari = "", mulai = "", sampai = "" } = req.query;
    let sql;
    let sqlFilterTanggal = "";
    if (mulai != "" && sampai != "") {
        sampai = sampai + " 23:59";
        sqlFilterTanggal = "and tanggal_jual between $2 and $3";
    }
    sqlFilterTanggal = sqlFilterTanggal + " and idtoko = " + req.context.idtoko;
    sql =
        "select idjual,fakturjual,nama_pelanggan,nama_pegawai,tanggal_jual,total,bayar,kembali,potongan from view_jual where (nama_pelanggan ILIKE '%" +
        cari +
        "%' or fakturjual ILIKE '%" +
        cari +
        "%') " +
        sqlFilterTanggal;
    let result = await koneksi.query(sql, [cari, mulai, sampai]);
    console.log(result);
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
router.get("/barang", async function(req, res, next) {
    let { cari = "", mulai = "", sampai = "" } = req.query;

    let sql;
    let sqlFilterTanggal = "";
    if (mulai != "" && sampai != "") {
        sampai = sampai + " 23:59";
        sqlFilterTanggal = "and tanggal_jual between $2 and $3";
    }
    sqlFilterTanggal = sqlFilterTanggal + " and idtoko = " + req.context.idtoko;
    sql =
        "select idbarang,barang,nama_satuan,nama_kategori,SUM(jumlahjual) as total_jual , SUM(hargajual) as total_pendapatan   from view_detailjual where (barang ILIKE '%" +
        cari +
        "%' or idbarang ILIKE '%" +
        cari +
        "%')" +
        sqlFilterTanggal +
        " group by idbarang,barang,nama_satuan,nama_kategori ";

    let result = await koneksi.query(sql, [cari, mulai, sampai]);
    console.log(result);
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
router.get("/kategori", async function(req, res, next) {
    let { cari = "", mulai = "", sampai = "" } = req.query;
    let sql;
    let sqlFilterTanggal = "";
    if (mulai != "" && sampai != "") {
        sampai = sampai + " 23:59";
        sqlFilterTanggal = "and tanggaL_jual between $2 and $3";
    }
    sqlFilterTanggal = sqlFilterTanggal + " and idtoko = " + req.context.idtoko;
    sql =
        "select idkategori,nama_kategori,SUM(jumlahjual) as total_jual,SUM(hargajual) as total_pendapatan  from view_detailjual where (nama_kategori ILIKE '%" +
        cari +
        "%') " +
        sqlFilterTanggal +
        " group by idkategori,nama_kategori";

    let result = await koneksi.query(sql, [cari, mulai, sampai]);
    console.log(result);
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
router.get("/pelanggan", async function(req, res, next) {
    let { cari = "", mulai = "", sampai = "" } = req.query;
    let sql;
    let sqlFilterTanggal = "";
    if (mulai != "" && sampai != "") {
        sampai = sampai + " 23:59";
        sqlFilterTanggal = "and tanggaL_jual between $2 and $3";
    }
    sqlFilterTanggal = sqlFilterTanggal + " and idtoko = " + req.context.idtoko;
    sql =
        "select idpelanggan,nama_pelanggan,alamat_pelanggan,no_telepon,SUM(jumlahjual) as total_jual , SUM(hargajual) as total_pendapatan   from view_detailjual where (nama_pelanggan ILIKE '%" +
        cari +
        "%') " +
        sqlFilterTanggal +
        " group by idpelanggan,nama_pelanggan,alamat_pelanggan,no_telepon";

    let result = await koneksi.query(sql, [cari, mulai, sampai]);
    console.log(result);
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
router.get("/pegawai", async function(req, res, next) {
    let { cari = "", mulai = "", sampai = "" } = req.query;
    let sql;
    let sqlFilterTanggal = "";
    if (mulai != "" && sampai != "") {
        sampai = sampai + " 23:59";
        sqlFilterTanggal = "and tanggaL_jual between $2 and $3";
    }

    sqlFilterTanggal = sqlFilterTanggal + " and idtoko = " + req.context.idtoko;
    sql =
        "select idpegawai,nama_pegawai,alamat_pegawai,no_pegawai,SUM(jumlahjual) as total_jual , SUM(hargajual) as total_pendapatan  from view_detailjual where (nama_pegawai ILIKE '%" +
        cari +
        "%')" +
        sqlFilterTanggal +
        "  group by idpegawai,nama_pegawai,alamat_pegawai,no_pegawai";
    let result = await koneksi.query(sql, [cari, mulai, sampai]);
    console.log(result);
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

module.exports = router;