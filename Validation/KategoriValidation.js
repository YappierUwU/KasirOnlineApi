const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
    return [
        body("nama_kategori")
        .isLength({ min: 1 })
        .withMessage("Nama Kategori tidak boleh kosong"),
    ];
}

module.exports = validate;