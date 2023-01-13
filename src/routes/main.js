const express = require("express");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const settings = require("../settings");
const tokenAuth = require("../middleware/tokenAuth");

let router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/register", (req, res) => {
    res.render("register", {
        error: false
    });
});

router.get("/login", (req, res) => {
    res.render("login", {
        error: false
    });
});

router.get("/dashboard", tokenAuth.verifyToken, (req, res) => {

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: settings.GMAIL_ACCOUNT_USERNAME,
            pass: settings.GMAIL_ACCOUNT_PASSWORD
        }
    });
    (async function getJoke() {
        try {
            const response = await fetch("https://api.chucknorris.io/jokes/random");
            const data = await response.json();
            res.render("dashboard", {
                data: data.value,
                email: req.user.user.email
            })
            let info = {
                from: settings.GMAIL_ACCOUNT_USERNAME,
                to: req.user.user.email,
                subject: "Chuck Norris Joke",
                text: data.value
            };
            transporter.sendMail(info, (error) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log("Email sent to: " + info.to + " with a joke: " + data.value);
                }
            });
        } catch {
            res.sendStatus(404);
        }
    })();
});

module.exports = router;