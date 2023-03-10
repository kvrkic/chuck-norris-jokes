const express = require("express");
const mongoose = require("mongoose");
const settings = require("./src/settings");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/auth");
const mainRoutes = require("./src/routes/main");

let app = express();

mongoose.set("strictQuery", false);
mongoose.connect(`${settings.MONGODB_URL}`);

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(authRoutes);
app.use(mainRoutes);

module.exports = app;