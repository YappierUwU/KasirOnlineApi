const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
    return [
        body("idbarang")
        .custom(checkID)
        .isLength({ min: 1 })
        .withMessage("Kode Produk tidak boleh kosong"),
        body("barang")
        .isLength({ min: 1 }, { max: 200 })
        .withMessage(
            "Nama Produk tidak boleh kosong dan tidak lebih dari 200 huruf"
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

async function checkID(idbarang, { req }) {
    let sql;
    if (req.method == "PUT") {
        sql =
            "select idbarang from tblbarang where username = $1 and username !='" +
            req.params.id +
            "'";
    } else {
        sql = "select idbarang from tblbarang where idbarang = $1";
    }
    let res = await db.query(sql, [idbarang]);
    return new Promise((resolve, reject) => {
        if (res.length > 0) {
            reject("Kode Produk sudah digunakan");
        }
        resolve();
    });
}

module.exports = validate;