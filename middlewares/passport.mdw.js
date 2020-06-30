const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session);
};