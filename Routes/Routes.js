const Auth = require("../Controller/Auth");
const Register = require("../Controller/Register");
const Satuan = require("../Controller/Satuan");
const Pelanggan = require("../Controller/Pelanggan");
const Kategori = require("../Controller/Kategori");
const Barang = require("../Controller/Barang");
const Pegawai = require("../Controller/Pegawai");
const Order = require("../Controller/Order");
const Orderdetail = require("../Controller/Detailjual");
const Report = require("../Controller/Report");
const chatRoute = require("../Component/chatting");
const authRoute = require("../Component/auth");
const Toko = require("../Controller/Toko");

function Route(app) {
    app.use("/auth", Auth);
    app.use("/toko", Toko);
    app.use("/register", Register);
    app.use("/satuan", Satuan);
    app.use("/pelanggan", Pelanggan);
    app.use("/kategori", Kategori);
    app.use("/barang", Barang);
    app.use("/pegawai", Pegawai);
    app.use("/order", Order);
    app.use("/report", Report);
    app.use("/detailjual", Orderdetail);
    app.use("/wa/chat", chatRoute);
    app.use("/wa/auth", authRoute);

    // If route not found
    // app.use(function(req, res, next) {
    //     if (!req.route)
    //         return res.status(404).json({ status: false, message: "Not Found" });
    //     next();
    // });
}

module.exports = Route;