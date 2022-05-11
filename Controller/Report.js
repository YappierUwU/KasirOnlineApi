var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");

router.get("/laba", async function (req, res, next) {
  const { cari = false } = req.query;

  let sql;
  if (cari) {
    sql =
      "select fakturjual,nama_pelanggan,nama_pegawai,tanggal_jual,barang,jumlahjual,nama_satuan,hargabeli,hargajual,idtoko,hargajual-hargabeli as laba from view_detailjual where nama_pelanggan = $1 or fakturjual = $1 ";
  }

  let result = await koneksi.query(sql, [cari]);
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

router.get("/pendapatan", async function (req, res, next) {
  const { cari = false } = req.query;
  let sql;
  if (cari) {
    sql =
      "select fakturjual,nama_pelanggan,nama_pegawai,tanggal_jual,total,bayar,kembali,potongan,total-kembali as pendapatan from view_jual where nama_pelanggan = $1 or fakturjual = $1 ";
  }
  let result = await koneksi.query(sql, [cari]);
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
router.get("/barang", async function (req, res, next) {
  const { cari = false } = req.query;

  let sql;
  if (cari) {
    sql =
      "select idbarang,barang,nama_satuan,nama_kategori,SUM(jumlahjual) as total_jual , SUM(hargajual) as total_pendapatan , hargajual - hargabeli as total_keuntungan  from view_detailjual where barang = $1 or idbarang = $1 group by idbarang,barang,nama_satuan,nama_kategori,jumlahjual,hargabeli,hargajual ";
  }

  let result = await koneksi.query(sql, [cari]);
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
router.get("/kategori", async function (req, res, next) {
  const { cari = false } = req.query;
  let sql;
  if (cari) {
    sql =
      "select idkategori,nama_kategori,SUM(jumlahjual) as total_jual,SUM(hargajual) as total_pendapatan  from view_detailjual where nama_kategori = $1  group by idkategori,nama_kategori,jumlahjual,hargajual ";
  }

  let result = await koneksi.query(sql, [cari]);
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
router.get("/pelanggan", async function (req, res, next) {
  const { cari = false } = req.query;
  let sql;
  if (cari) {
    sql =
      "select idpelanggan,nama_pelanggan,alamat_pelanggan,no_telepon,SUM(jumlahjual) as total_jual , SUM(hargajual) as total_pendapatan , hargajual - hargabeli as total_keuntungan  from view_detailjual where nama_pelanggan = $1  group by idpelanggan,nama_pelanggan,alamat_pelanggan,no_telepon,jumlahjual,hargabeli,hargajual";
  }

  let result = await koneksi.query(sql, [cari]);
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
router.get("/pegawai", async function (req, res, next) {
  const { cari = false } = req.query;
  let sql;
  if (cari) {
    sql =
      "select idpegawai,nama_pegawai,alamat_pegawai,no_pegawai,SUM(jumlahjual) as total_jual , SUM(hargajual) as total_pendapatan , hargajual - hargabeli as total_keuntungan  from view_detailjual where nama_pegawai = $1  group by idpegawai,nama_pegawai,alamat_pegawai,no_pegawai,jumlahjual,hargabeli,hargajual";
  }

  let result = await koneksi.query(sql, [cari]);
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
