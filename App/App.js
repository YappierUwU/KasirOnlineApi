const express = require("express");
const app = express();
// const qrcode = require("qrcode-terminal");
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
const qrcode = require("qrcode");
const socketIO = require("socket.io");
const http = require("http");
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
app.get("/wa", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.get("/", (req, res) => {
    res.send("Api kasir");
});

app.use(function(req, res, next) {
    next();
});

const server = http.createServer(app);

const io = socketIO(server, {
    path: "/socket.io.whatsapp",
});
client.initialize();
var qrLast;
var today = new Date();
var now = today.toLocaleString();

io.on("connection", (socket) => {
    socket.emit("message", `${now} Connected`);
    if (qrLast) {
        socket.emit("qr", qrLast);
    }

    if (authed) {
        socket.emit("authed", true);
    }
    client.on("qr", (qr) => {
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit("qr", url);
            qrLast = url;
            socket.emit("message", `${now} QR Code received`);
        });
    });

    client.on("ready", () => {
        authed = true;
        socket.emit("message", `${now} WhatsApp is ready!`);
        socket.emit("authed", `Ready to send messages`);
    });

    client.on("authenticated", () => {
        authed = true;
        socket.emit("message", `${now} Whatsapp is authenticated!`);
        socket.emit("authed", `Ready to send messages`);
    });

    client.on("auth_failure", function(session) {
        socket.emit("message", `${now} Auth failure, restarting...`);
    });

    client.on("disconnected", function() {
        socket.emit("message", `${now} Disconnected`);
    });
});

//Otp Whatsapp
// client.on("qr", (qr) => {
//     console.log(qr);
//     qrcode.generate(qr, { small: true });
//     fs.writeFileSync("./Component/last.qr", qr);
// });

// client.on("authenticated", () => {
//     console.log("AUTH!");
//     authed = true;

//     try {
//         fs.unlinkSync("./Component/last.qr");
//     } catch (err) {}
// });

// client.on("auth_failure", () => {
//     console.log("AUTH Failed !");
//     process.exit();
// });

// client.on("ready", () => {
//     console.log("Client is ready!");
// });

// client.on("change_state", (state) => {
//     console.log("CHANGE STATE", state);
// });

// client.on("disconnected", () => {
//     console.log("disconnected");
// });

// client.initialize();

process.on("SIGINT", async() => {
    await client.destroy();
    process.exit(0);
});

module.exports = server;