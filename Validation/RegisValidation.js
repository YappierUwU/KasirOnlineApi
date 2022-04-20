const { body } = require("express-validator");
const db = require("../Util/Database");
function validate() {
  return [
    body("username").custom(checkUsername),
    body("idappointments").custom(checkAppointment),
    body("date_regist").isDate(),
    body("date_book").isDate(),
    body("time_book").matches("^([0-2][0-9]):[0-5][0-9]$").custom(checkTime),
    body("flagstatus").isNumeric(),
  ];
}
async function checkAppointment(id) {
  let sql = "SELECT id FROM appointments WHERE id =$1";
  let res = await db.query(sql, [id]);
  return new Promise((resolve, reject) => {
    if (res.length == 0) {
      reject("Appointment Not Found");
    }
    resolve();
  });
}

async function checkTime(id, { req }) {
  let date = req.body.date_book;
  let sql =
    "SELECT username FROM registrant WHERE time_book =$1 AND date_book =$2";
  let res = await db.query(sql, [id, date]);
  return new Promise((resolve, reject) => {
    if (res.length > 0 && req.method == "POST") {
      reject("Time has been booked");
    }
    resolve();
  });
}

async function checkUsername(username) {
  let sql = "SELECT username FROM users WHERE username =$1 and roles=2";
  let res = await db.query(sql, [username]);
  return new Promise((resolve, reject) => {
    if (res.length == 0) {
      reject("Username Not Found");
    }
    resolve();
  });
}

module.exports = validate;
