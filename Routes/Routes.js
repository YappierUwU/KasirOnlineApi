const Auth = require("../Controller/Auth");
const Register = require("../Controller/Register");
const Satuan = require("../Controller/Satuan");
const Pelanggan = require("../Controller/Pelanggan");
const Kategori = require("../Controller/Kategori");
const Barang = require("../Controller/Barang");

function Route(app) {
  app.use("/auth", Auth);
  app.use("/register", Register);
  app.use("/satuan", Satuan);
  app.use("/pelanggan", Pelanggan);
  app.use("/kategori", Kategori);
  app.use("/barang", Barang);

  // If route not found
  // app.use(function (req, res, next) {
  //   if (!req.route)
  //     return res.status(404).json({ status: false, message: "Not Found" });
  //   next();
  // });
}

module.exports = Route;
