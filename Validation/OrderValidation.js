const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
  return [
    body("fakturjual")
      .isLength({ min: 1 })
      .withMessage("fakturjual tidak boleh kosong"),
    body("bayar")
      .isLength({ min: 1 })
      .withMessage("bayar tidak boleh kosong")
      .isNumeric()
      .withMessage("bayar harus menggunakan angka"),
    body("total")
      .isLength({ min: 1 })
      .withMessage("total tidak boleh kosong ")
      .isNumeric()
      .withMessage("total harus berisi angka"),
    body("kembali")
      .isLength({ min: 1 })
      .withMessage("kembali tidak boleh kosong ")
      .isNumeric()
      .withMessage("kembali harus berisi angka"),
    body("potongan")
      .isLength({ min: 1 })
      .withMessage("potongan tidak boleh kosong ")
      .isNumeric()
      .withMessage("potongan harus berisi angka"),
    body("idpelanggan")
      .isLength({ min: 1 })
      .withMessage("idpelanggan tidak boleh kosong"),
    body("idpegawai")
      .isLength({ min: 1 })
      .withMessage("idpegawai tidak boleh kosong"),
    body("tanggal_jual")
      .isLength({ min: 1 })
      .withMessage("tanggal_jual tidak boleh kosong"),
  ];
}

module.exports = validate;
