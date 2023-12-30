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

app.get("/auth/google", (req, res, next) => {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
})

app.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", { successRedirect: "/protected", failureMessage: "error with google auth" })(req, res, next);
})

app.get("/protected", authLoggedIn, (req, res) => {
    const data = req.user;
    res.send(`<h1>top secret! Hello ${data.displayName} &lt;${data.email}&gt;</h1>`)
})

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log("listening on port " + PORT));

// module.exports = app;