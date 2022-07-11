const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
    return [
        body("email").isEmail().custom(checkEmail),
        body("password")
        .isLength({ min: 8 })
        .withMessage("Password Minimal 8 huruf"),
        body("nomer_toko").isMobilePhone().custom(checkNomer),
    ];
}

async function checkNomer(nomer, { req }) {
    let sql;
    if (req.method == "PUT") {
        sql =
            "select nomer_toko from tbltoko where username = $1 and username !='" +
            req.params.id +
            "'";
    } else {
        sql = "select nomer_toko from tbltoko where nomer_toko = $1";
    }
    let res = await db.query(sql, [nomer]);
    return new Promise((resolve, reject) => {
        if (res.length > 0) {
            reject("Nomer Telepon Sudah Digunakan");
        }
        resolve();
    });
}

async function checkEmail(email, { req }) {
    let sql;
    if (req.method == "PUT") {
        sql =
            "select email from tbltoko where username = $1 and username !='" +
            req.params.id +
            "'";
    } else {
        sql = "select email_toko from tbltoko where email_toko = $1";
    }
    let res = await db.query(sql, [email]);
    return new Promise((resolve, reject) => {
        if (res.length > 0) {
            reject("Email telah digunakan, harap gunakan email yang lain");
        }
        resolve();
    });
}

module.exports = validate;