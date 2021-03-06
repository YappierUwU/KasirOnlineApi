const jwt = require("jsonwebtoken");
var key = "85838781494488976149270763900171";

function generate(username, role) {
    return jwt.sign({ idtoko: username, role: role, project: "KasirOnline" },
        key
    );
}

function verify(req, res, next) {
    try {
        let token = req.headers.authorization;
        var decoded = jwt.verify(token, key);
        if (decoded.project == "KasirOnline") {
            req.context = decoded;
            next();
        } else {
            res
                .status(401)
                .json({
                    status: false,
                    message: "Token tidak valid, silahkan logout dan login ulang",
                });
        }
    } catch (err) {
        res
            .status(401)
            .json({
                status: false,
                message: "Token tidak valid, silahkan logout dan login ulang",
            });
    }
}

module.exports = {
    generate: generate,
    verify: verify,
};