var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const { toIsoString } = require("../Util/Modul");
const path = require("path");
const { encrypt } = require("../Util/Encrypt");
const { setLoggedAccount, isLogged, getLoggedAccount } = require("../Util/AuthConfig");


router.get("/login", function(req, res) {
    if (isLogged(req)) {
        res.redirect("/admin/dashboard")
    } else {
        res.render(path.join(__dirname, "../public/auth"));
    }

});

router.post("/auth", (req, res) => {
    const { username = "", password = "" } = req.body
    let result = koneksi.oneOrNone(`
        select * from tbladmin where username=$1 and password=$2
    `, [username, encrypt(password)])
    result.then((data) => {
        if (data) {
            setLoggedAccount(req, data)
            res.json({
                status: true,
                message: "Username dan password ditemukan"
            })
        } else {
            res.json({
                status: false,
                message: "Ussername dan password tidak ditemukan"
            })
        }
    })

})

// Middleware
router.use((req, res, next) => {
    if (isLogged(req)) {
        next()
    } else {
        res.redirect("/admin/login");
    }
})

router.get("/dashboard", function(req, res) {
    let result = koneksi.oneOrNone(
        `SELECT (select count(*) from tbljual) jumlah_faktur, (select count(*) from tbltoko where nama_pemilik is not NULL) jumlah_pengguna`
    );
    result.then((data) => {

        res.render(path.join(__dirname, "../public/dashboard"), { data });
    })
});

router.get("/pelanggan", function(req, res) {
    let timestamp = toIsoString(req.query.timestamp)
    let result = koneksi.query(
        `select nama_pemilik,email_toko,nomer_toko,email_toko,created_at from tbltoko where created_at < $1 and nama_pemilik is not NULL and (nama_pemilik ilike '%$2:value%' or email_toko ilike '%$2:value%') order by created_at DESC limit 20`, [timestamp, req.query.cari ? req.query.cari : ""]
    );
    result.then((result) => {
        res.status(200).json({
            status: true,
            data: result,
        });
    }).catch((e) => {
        res.status(400).json({
            status: false,
            data: {},
            message: "Data tidak ditemukan",
        });
    })

})

router.post("/change_password", (req, res) => {
    let { old_password, new_password } = req.body
    old_password = encrypt(old_password)
    new_password = encrypt(new_password)
    let result = koneksi.oneOrNone(
        "update tbladmin set password=$1 where username=$2 and password=$3 returning *", [new_password, getLoggedAccount(req).username, old_password])
    result.then((data) => {
        if (data) {
            res.json({
                status: true,
                message: "Password berhasil diganti"
            })
        } else {
            res.json({
                status: false,
                message: "Password lama salah"
            })
        }
    }).catch(() => {
        res.json({
            status: false,
            message: "Password lama salah"
        })
    })

})

router.get("/pengguna", function(req, res) {
    res.render(path.join(__dirname, "../public/pengguna"));
});
router.get("/akun", function(req, res) {
    res.render(path.join(__dirname, "../public/profile"));
});

router.get("/whatsapp", function(req, res) {
    res.render(path.join(__dirname, "../public/whatsapp"));
});
router.get("/logout", function(req, res) {
    req.session.destroy((err) => {
        res.redirect('/admin/login');
    })

});
router.get("/", function(req, res) {
    res.redirect("/admin/dashboard")
});

module.exports = router;