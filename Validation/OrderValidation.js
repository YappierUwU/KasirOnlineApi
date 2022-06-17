const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
    return [
        body("bayar")
        .isLength({ min: 1 })
        .withMessage("Nominal Bayar tidak boleh kosong")
        .isNumeric()
        .withMessage("Nominal Bayar harus menggunakan angka"),
        body("total")
        .isLength({ min: 1 })
        .withMessage("Nominal total tidak boleh kosong ")
        .isNumeric()
        .withMessage("Nominal total harus berisi angka"),
        body("kembali")
        .isLength({ min: 1 })
        .withMessage("Nominal kembali tidak boleh kosong ")
        .isNumeric()
        .withMessage("Nominal kembali harus berisi angka"),
        body("potongan")
        .isLength({ min: 1 })
        .withMessage("Nominal Potongan tidak boleh kosong ")
        .isNumeric()
        .withMessage("Nominal Potongan harus berisi angka"),
        body("idpelanggan")
        .isLength({ min: 1 })
        .withMessage("idpelanggan tidak boleh kosong"),
        body("idpegawai")
        .isLength({ min: 1 })
        .withMessage("idpegawai tidak boleh kosong"),
        body("tanggal_jual")
        .isLength({ min: 1 })
        .withMessage("Tanggal Penjualan tidak boleh kosong"),
    ];
}

module.exports = validate;