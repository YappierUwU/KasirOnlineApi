var express = require("express");
var koneksi = require("../Util/Database");
const router = require("express").Router();
const { MessageMedia } = require("whatsapp-web.js");
const request = require("request");
const vuri = require("valid-url");
const fs = require("fs");
const { generate } = require("../Util/JWT");
const { encrypt } = require("../Util/Encrypt");
const validate = require("../Validation/UserValidation");
const handlerInput = require("../Util/ValidationHandler");

function generateToken() {
    let digit1 = Math.floor(Math.random() * 9).toString();
    let digit2 = Math.floor(Math.random() * 9).toString();
    let digit3 = Math.floor(Math.random() * 9).toString();
    let digit4 = Math.floor(Math.random() * 9).toString();
    return digit1 + digit2 + digit3 + digit4;
}
// twlp
// nama pemilik nama usaha lokasui usaha jenis usaha
router.post("/minta", async function(req, res) {
    let sql = "update tbltoko set nomer_toko=$1  where idtoko=$2";
    koneksi.none(sql, [req.body.nomer_toko, req.context.idtoko]);
    let otp =
        "insert into tblotp (idtoko,otp,created_at,status) values ($1,$2,$3,$4)";
    let timer =
        "select created_at from tblotp where idtoko=$1 order by created_at desc";
    let token = generateToken();
    token = token.toString();
    const created_at = new Date();
    let isi = [req.context.idtoko, token, created_at, 0];
    koneksi.none(otp, isi, timer, [req.body.created_at]);
    let message =
        "TERIMA KASIH TELAH MENDAFTAR DI APLIKASI KAMI , JANGAN BERIKAN KODE INI PADA SIAPAPUN " +
        token;

    // res.status(200).json({
    //     status: true,
    //     token: token,
    // });
    client
        .sendMessage(req.body.nomer_toko + "@c.us", message)
        .then((response) => {
            console.log(response);
            res.status(200).json({
                status: true,
                token: token,
            });
        })
        .catch((e) => {
            console.error(e);
            res.status(304).json({
                status: false,
            });
        });
});

router.post("/verifikasi", async function(req, res, next) {
    let sql = `select * from tblotp where otp = $1 and idtoko=$2`;
    koneksi
        .any(sql, [req.body.otp, req.context.idtoko])
        .then((data) => {
            if (data.length == 0) {
                res.status(304).json({
                    status: false,
                    message: "Kode Otp Salah",
                });
            } else {
                koneksi.none(`delete from tblotp where idtoko=$1`, [
                    req.context.idtoko,
                ]);
                res.status(200).json({
                    status: true,
                    message: "Kode Otp Benar",
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post("/profile", async function(req, res, next) {
    let sql = `UPDATE tbltoko set nama_toko=$1, alamat_toko=$2, nama_pemilik=$3, jenis_toko=$4 where idtoko=$5 `;
    let sqlpegawai = `insert into tblpegawai (nama_pegawai,alamat_pegawai,no_pegawai,idtoko,pin) select nama_pemilik,alamat_toko,nomer_toko,$1,$2 from tbltoko where idtoko=$1`;
    let data = [
        req.body.nama_toko,
        req.body.alamat_toko,
        req.body.nama_pemilik,
        req.body.jenis_toko,
        req.context.idtoko,
    ];
    koneksi.none(sql, data).then(() => {
        koneksi.none(sqlpegawai, [req.context.idtoko, "1234"]);
    });
    res.json({
        message: "data berhasil diubah",
    });
    //
});

router.post("/barang", handlerInput, async function(req, res, next) {
    try {
        let satuan = await koneksi.oneOrNone(
            "insert into tblsatuan (nama_satuan) values ($1) returning idsatuan", [req.body.nama_satuan]
        );
        let kategori = await koneksi.oneOrNone(
            "insert into tblkategori (nama_kategori) values ($1) returning idkategori", [req.body.nama_kategori]
        );

        let sql = `INSERT INTO tblbarang (idbarang,idkategori,idsatuan,barang,harga,hargabeli, idtoko) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
        let data = [
            req.body.idbarang,
            kategori,
            satuan,
            req.body.barang,
            req.body.harga,
            req.body.hargabeli,
            req.body.idtoko,
        ];

        koneksi.any(sql, data);
        res.status(200).json({
            status: true,
            data: req.body,
        });
    } catch (error) {
        res.status(501).json({
            status: false,
            message: error,
        });
    }

    //
});

module.exports = router;