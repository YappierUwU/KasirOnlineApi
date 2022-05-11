const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
  return [
    body("email").isEmail().custom(checkEmail),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password Minimal 8 huruf"),
  ];
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
      reject("Email already used");
    }
    resolve();
  });
}

module.exports = validate;
