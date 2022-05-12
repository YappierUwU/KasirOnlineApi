const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
  return [
    body("nama_satuan")
      .isLength({ min: 1 })
      .withMessage("Nama satuan tidak boleh kosong"),
  ];
}

module.exports = validate;
