const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
  return [
    body("idjual")
      .isLength({ min: 1 })
      .withMessage("idjual tidak boleh kosong "),
    body("idjual")
      .isLength({ min: 1 })
      .withMessage("idjual tidak boleh kosong "),
    body("idbarang")
      .isLength({ min: 1 })
      .withMessage("idbarang tidak boleh kosong"),
    body("jumlahjual")
      .isLength({ min: 1 })
      .withMessage("jumlah jual tidak boleh kosong "),
    body("hargajual")
      .isLength({ min: 1 })
      .withMessage("hargajual tidak boleh kosong ")
      .isNumeric()
      .withMessage("hargajual harus berisi angka"),
  ];
}

module.exports = validate;
