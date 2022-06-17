const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
    return [
        body("nama_pelanggan")
        .isLength({ min: 1 })
        .withMessage("Nama Pelanggan tidak boleh kosong"),
        body("alamat_pelanggan")
        .isLength({ min: 1 })
        .withMessage("Alamat Pelanggan tidak boleh kosong"),
        body("no_telepon")
        .isLength({ min: 1 })
        .withMessage("Nomer telepon Pelanggan tidak boleh kosong ")
        .isMobilePhone()
        .withMessage("Harap isi nomor telepon dengan benar"),
    ];
}

module.exports = validate;