const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
  return [
    body("nama_pelanggan")
      .isLength({ min: 1 })
      .withMessage("nama pelanggan tidak boleh kosong"),
    body("alamat_pelanggan")
      .isLength({ min: 1 })
      .withMessage("alamat pelanggan tidak boleh kosong"),
    body("no_telepon")
      .isLength({ min: 1 })
      .withMessage("no telepon tidak boleh kosong ")
      .isMobilePhone()
      .withMessage("harap isi nomor telepon dengan benar"),
  ];
}

module.exports = validate;
