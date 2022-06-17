const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
    return [
        body("nama_pegawai")
        .isLength({ min: 1 })
        .withMessage("Nama pegawai tidak boleh kosong"),
        body("alamat_pegawai")
        .isLength({ min: 1 })
        .withMessage("Alamat pegawai tidak boleh kosong"),
        body("no_pegawai")
        .isLength({ min: 1 })
        .withMessage("Nomer Telepon Pegawai tidak boleh kosong ")
        .isMobilePhone()
        .withMessage("Harap isi Nomor Telepon dengan benar"),
        body("pin")
        .isLength({ min: 1 })
        .withMessage("Pin Pegawai tidak boleh kosong ")
        .isNumeric()
        .withMessage("Pin Pegawai harus berisi angka"),
    ];
}

module.exports = validate;