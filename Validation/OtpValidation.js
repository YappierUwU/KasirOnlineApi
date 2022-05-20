const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
  return [body("nomer_toko").isMobilePhone().custom(checkNomer)];
}

async function checkNomer(nomer, { req }) {
  let sql;
  if (req.method == "PUT") {
    sql =
      "select nomer_toko from tbltoko where username = $1 and username !='" +
      req.params.id +
      "'";
  } else {
    sql =
      "select nomer_toko from tbltoko where nomer_toko = $1 and idtoko != $2";
  }
  let res = await db.query(sql, [nomer, req.context.idtoko]);
  return new Promise((resolve, reject) => {
    if (res.length > 0) {
      reject("nomer sudah digunakan");
    }
    resolve();
  });
}

module.exports = validate;
