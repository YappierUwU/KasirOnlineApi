const express = require("express");
const app = express();
require("dotenv").config();
const cmpression = require("compression");
const config = require("../config.json");
var path = require("path");
app.use(cmpression());
const fs = require("fs");
const bodyParser = require("body-parser");
const { Client, LocalAuth } = require("whatsapp-web.js");
const axios = require("axios");
("express-validator");
app.use(express.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

global.client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ["--no-sandbox"] },
});

global.authed = false;
const Middleware = require("../Middleware/Middleware");
const Route = require("../Routes/Routes");
const Cors = require("cors");
//CORS
var whitelist = [
    "https://webdokter.herokuapp.com",
    "http://localhost:3000",
    "https://api-dokter.herokuapp.com",
];
var corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(Cors());

app.use(function(req, res, next) {
    // Website you wish to allow to connect
    // res.setHeader(
    //   "Access-Control-Allow-Origin",
    //   "https://webdokter.herokuapp.com"
    // );
    const origin = req.headers.origin;
    if (whitelist.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});

//Make body readable
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//Add middleware
app.use(Middleware);

//Add Routes
Route(app);

app.get("/", (req, res) => {
    res.send("Api kasir");
});

//Otp Whatsapp

client.on("qr", (qr) => {
    console.log("qr");
    fs.writeFileSync("./Component/last.qr", qr);
});

client.on("authenticated", () => {
    console.log("AUTH!");
    authed = true;

    try {
        fs.unlinkSync("./Component/last.qr");
    } catch (err) {}
});

client.on("auth_failure", () => {
    console.log("AUTH Failed !");
    process.exit();
});

client.on("ready", () => {
    console.log("Client is ready!");
});

client.on("message", async(msg) => {
    if (config.webhook.enabled) {
        if (msg.hasMedia) {
            const attachmentData = await msg.downloadMedia();
            msg.attachmentData = attachmentData;
        }
        axios.post(config.webhook.path, { msg });
    }
});
client.on("disconnected", () => {
    console.log("disconnected");
});
client.initialize();

app.use(function(req, res, next) {
    console.log(req.method + " : " + req.path);
    next();
});

module.exports = app;