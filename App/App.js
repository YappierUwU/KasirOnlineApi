const express = require("express");
const app = express();
const qrcode = require("qrcode-terminal");
require("dotenv").config();
const cmpression = require("compression");
var path = require("path");
app.use(cmpression());
const fs = require("fs");
const bodyParser = require("body-parser");
const { Client, LocalAuth } = require("whatsapp-web.js");
const Middleware = require("../Middleware/Middleware");
const Route = require("../Routes/Routes");
const Cors = require("cors");

app.use(express.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

global.client = new Client({
    authStrategy: new LocalAuth({ clientId: "apitoko" }),
    puppeteer: { headless: true, args: ["--no-sandbox"] },
});

global.authed = false;

app.use(Cors());

app.use(function(req, res, next) {
    const origin = req.headers.origin;
    // if (whitelist.includes(origin)) {
    //     res.setHeader("Access-Control-Allow-Origin", origin);
    // }
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, DELETE"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    res.setHeader("Access-Control-Allow-Credentials", true);

    next();
});

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
    console.log(qr);
    qrcode.generate(qr, { small: true });
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

client.on("change_state", (state) => {
    console.log("CHANGE STATE", state);
});

client.on("disconnected", () => {
    console.log("disconnected");
});

client.initialize();
app.use(function(req, res, next) {
    next();
});

process.on("SIGINT", async() => {
    await client.destroy();
    process.exit(0);
});

module.exports = app;