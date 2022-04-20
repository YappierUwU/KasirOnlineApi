const { body } = require("express-validator");

function validate() {
  return [
    body("doctor").notEmpty(),
    body("address").notEmpty(),
    body("phonenumber").isNumeric().withMessage("Must be Numeric"),
  ];
}

module.exports = validate;
