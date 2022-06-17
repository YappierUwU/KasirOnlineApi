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
        .withMessage("Kategori tidak boleh kosong "),
        body("idsatuan")
        .isLength({ min: 1 })
        .withMessage("Satuan tidak boleh kosong "),
        body("harga")
        .isLength({ min: 1 })
        .withMessage("Harga Jual tidak boleh kosong ")
        .isNumeric()
        .withMessage("Harga Jual harus berisi angka"),
        body("hargabeli")
        .isLength({ min: 1 })
        .withMessage("Harga Beli tidak boleh kosong ")
        .isNumeric()
        .withMessage("Harga Beli harus berisi angka"),
    ];
}

module.exports = validate;