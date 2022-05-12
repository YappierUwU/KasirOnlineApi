const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
  return [
    body("nama_toko")
      .isLength({ min: 1 })
      .withMessage("nama toko tidak boleh kosong"),
    body("alamat_toko")
      .isLength({ min: 1 })
      .withMessage("alamat toko tidak boleh kosong"),
    body("nama_pemilik")
      .isLength({ min: 1 })
      .withMessage("nama pemilik tidak boleh kosong "),
    body("jenis_toko")
      .isLength({ min: 1 })
      .withMessage("jenis toko tidak boleh kosong "),
  ];
}

module.exports = validate;
