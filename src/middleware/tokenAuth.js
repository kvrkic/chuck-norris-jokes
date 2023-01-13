const jwt = require("jsonwebtoken");
const settings = require("../settings");

module.exports.createToken = (req, res, user) => {
    jwt.sign({ user }, settings.JWT_SIGNING_KEY, { expiresIn: settings.JWT_EXPIRY_TIME }, (error, token) => {
        res.cookie("token", token, {
            httpOnly: true
        });
        return res.redirect("dashboard");
    });
}

module.exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    jwt.verify(token, settings.JWT_SIGNING_KEY, (error, user) => {
        if (error) {
            res.clearCookie("token");
            return res.redirect("/login");
        }
        req.user = user;
        next();
    });
}