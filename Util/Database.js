var promise = require("bluebird");

var options = {
    // Initialization Options
    promiseLib: promise,
};

var pgp = require("pg-promise")(options);
// var connectionString =
//   "postgres://ogkhatpkhgdein:48ef020621fda4972802a48bee243d962ca8bd11e04029019b8111c0e39aa626@ec2-34-195-143-54.compute-1.amazonaws.com:5432/d2ke523leggc54";
require("dotenv").config();
let ssl = { rejectUnauthorized: false };
const config = {
    connectionString: process.env.CONNECTION_STRING,
    ssl: false,
};
var db = pgp(config);

module.exports = db;