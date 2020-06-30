/*const express = require('express');
const router = express.Router();
const app = express();
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt= require('bcrypt')
const loginModel = require('../models/user.model');


app.use(passport.initialize());
app.use(passport.session);
router.get('/', function (req, res, next) {
    console.log('login')
    if (req.isAuthenticated()) {
        res.redirect('/');
    }
    else{
        res.render('/login')
    }
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
    }));

passport.use('local', new  localStrategy({passReqToCallback : true}, (req, username, password, done) => {
    loginAttempt();
    async function loginAttempt() {
        const {username, password} = req.body
        try{
            const result = await loginModel.byName(username);
                if(result[0])
                {
                    var hashed = result[0].password
                    var validUser = bcrypt.compareSync(password, hashed)
                    if(validUser)
                    {
                        var {userId, name} = req.session;
                        req.session.userId = result[0].id;
                        req.session.name = result[0].username;
                        return done(null,result[0]);
                    }
                    else
                    {
                        return done(null,false);
                    }
                }
                else
                {
                    res.render('login',{isLoginFalse: true});
                }
        }
        catch(e){throw (e);}
        };
    }
))

module.exports = router;*/