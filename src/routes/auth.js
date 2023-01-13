const express = require("express");
const model = require("../model");
const bcrypt = require("bcryptjs");
const tokenAuth = require("../middleware/tokenAuth");
const settings = require("../settings");

let router = express.Router();

router.post("/register", (req, res) => {
    let hash = bcrypt.hashSync(req.body.password, settings.BCRYPT_WORK_FACTOR);
    req.body.password = hash;
    let user = new model.User(req.body);
    user.save((error) => {
        if (error) {
            if (error.code === settings.DUPLICATE_EMAIL_ERROR) {
                return res.render("register", {
                    error: "Email is already in use, please use a different email."
                });
            } else {
                return res.render("register", {
                    error: "There was an error. Please try again."
                });
            }
        }
        tokenAuth.createToken(req, res, user);
    });
});
router.post("/login", (req, res) => {
    model.User.findOne({ email: req.body.email }, (error, user) => {
        if (error || !user || !bcrypt.compareSync(req.body.password, user.password)) {
            return res.render("login", {
                error: "Wrong email/password"
            });
        };
        tokenAuth.createToken(req, res, user);
    });
});

module.exports = router;