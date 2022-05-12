const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
  return [
    body("nama_pegawai")
      .isLength({ min: 1 })
      .withMessage("nama pegawai tidak boleh kosong"),
    body("alamat_pegawai")
      .isLength({ min: 1 })
      .withMessage("alamat pegawai tidak boleh kosong"),
    body("no_pegawai")
      .isLength({ min: 1 })
      .withMessage("no pegawai tidak boleh kosong ")
      .isNumeric()
      .withMessage("no pegawai harus berisi angka"),
    body("pin")
      .isLength({ min: 1 })
      .withMessage("pin tidak boleh kosong ")
      .isNumeric()
      .withMessage("pin harus berisi angka"),
  ];
}

module.exports = validate;
