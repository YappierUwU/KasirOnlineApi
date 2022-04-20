var promise = require("bluebird");

var options = {
    // Initialization Options
    promiseLib: promise,
};

var pgp = require("pg-promise")(options);

let ssl = { rejectUnauthorized: false };
const config = {
    connectionString: process.env.CONNECTION_STRING,
    ssl: false,
};
var db = pgp(config);

module.exports = db;