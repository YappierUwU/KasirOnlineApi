const express = require("express");
require("dotenv").config();
const cmpression = require("compression");
const path = require("path");
const bodyParser = require("body-parser");
const { Client, LocalAuth } = require("whatsapp-web.js");
const Middleware = require("../Middleware/Middleware");
const Route = require("../Routes/Routes");
const Cors = require("cors");
const qrcode = require("qrcode");
const socketIO = require("socket.io");
const http = require("http");
const session = require('express-session');
const app = express();
app.use(cmpression());
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

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));
app.use(Middleware);
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
Route(app);

const server = http.createServer(app);
const io = socketIO(server, {
    path: "/socket.io.whatsapp",
});
client.initialize();
var qrLast;
var today = new Date();
var now = today.toLocaleString();

io.on("connection", (socket) => {
    socket.emit("message", `${now}: Terhubung`);
    if (qrLast) {
        socket.emit("qr", qrLast);
    }

    if (authed) {
        socket.emit("authed", `${now}: Whatsapp siap digunakan`);
    }
    client.on("qr", (qr) => {
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit("qr", url);
            qrLast = url;
            socket.emit("message", `${now}: QR Code didapatkan`);
        });
    });

    client.on("ready", () => {
        authed = true;
    });

    client.on("authenticated", () => {
        authed = true;
        socket.emit("authed", `${now}: Whatsapp siap digunakan`);
    });

    client.on("auth_failure", function(session) {
        socket.emit("message", `${now}: Terjadi kesalahan saat menyambungkan`);
    });

    client.on("disconnected", function() {
        socket.emit("message", `${now}: Terputus`);
    });
});


process.on("SIGINT", async() => {
    await client.destroy();
    process.exit(0);
});

module.exports = server;