const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
  return [
    body("barang")
      .isLength({ min: 1 }, { max: 200 })
      .withMessage(
        "Nama barang tidak boleh kosong dan tidak lebih dari 200 huruf"
      ),
    body("idkategori")
      .isLength({ min: 1 })
      .withMessage("idkategori tidak boleh kosong "),
    body("idsatuan")
      .isLength({ min: 1 })
      .withMessage("idsatuan tidak boleh kosong "),
    body("harga")
      .isLength({ min: 1 })
      .withMessage("harga tidak boleh kosong ")
      .isNumeric()
      .withMessage("harga harus berisi angka"),
    body("hargabeli")
      .isLength({ min: 1 })
      .withMessage("hargabeli tidak boleh kosong ")
      .isNumeric()
      .withMessage("hargabeli harus berisi angka"),
  ];
}

module.exports = validate;
