require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");

require("./strategies/google");

const app = express();

function authLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("<a href=\"/auth/google\">sign in with google</a>")
});

app.get("/auth/google", (req, res) => {
    passport.authenticate("google", { scope: ["profile"] })(req, res);
})

app.get("/auth/google/callback", (req, res) => {
    passport.authenticate("google", { successRedirect: "/protected", failureMessage: "error with google auth" })
})

app.get("/protected", authLoggedIn, (req, res) => {
    res.send("<h1>top secret!</h1>")
})

app.listen(5500, () => console.log("listening on port 5500"));