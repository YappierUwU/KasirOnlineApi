const { body } = require("express-validator");
const db = require("../Util/Database");
function validate() {
  return [
    body("iddoctor").custom(checkDoctor),
    body("starttime").matches("^([0-2][0-9]):[0-5][0-9]$"),
    body("endtime").matches("^([0-2][0-9]):[0-5][0-9]$").custom(checkTime),
    body("description").notEmpty(),
    body("duration").isNumeric(),
  ];
}

function checkTime(time,{req}){
  let starttime = new Date("2021-04-04 "+req.body.starttime)
  let endtime = new Date("2021-04-04 "+time)
  return new Promise((resolve, reject) => {
      if(starttime.getTime() > endtime.getTime()){
          reject("End time must be more from start time");
      }else{
        resolve()
      }
  })
  
}

async function checkDoctor(id) {
  let sql = "SELECT doctor FROM doctors WHERE id = $1";
  let data = await db.query(sql, [id]);
  return new Promise((resolve, reject) => {
    if (data.length == 0) {
      reject("Doctor Not Found");
    } else {
      resolve();
    }
  });
}

module.exports = validate;
