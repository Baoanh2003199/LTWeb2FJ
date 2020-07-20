const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(
    express.urlencoded({
        extended: true,
    })
);

const catModel = require('./models/category.model');
const subModel = require('./models/subscriber.model');
// Include MiddleWare
// - View: Config for view handlebars
require('./middlewares/views.mdw')(app);
// - Session: Config for session
require('./middlewares/session.mdw')(app);
// - Locals: Set local Variable
require('./middlewares/locals.mdw')(app);
// // - Body parse: Catch data from POST and GET method
// require('./middlewares/bodyparse.mdw')(app);
//require('./middlewares/passport.mdw')(app);
// Set Public path for asset

app.use('/public',express.static(__dirname + '/public'));

const redirectLogin = (req, res, next)=>{
    if(!res.locals.isLoggedIn)
    {
        req.app.locals.layout = 'main';
        res.redirect('/login');
    }
    else
    {
        next();
    }
}

// Set Layout prefix url is "/admin" is admin.hbs
app.all('/admin*', function(req, res, next) {
    req.app.locals.layout = 'admin';
    next();
});
app.all('/profile*', function(req, res, next) {
        req.app.locals.layout = 'profile';
        next();
});
// Set Layout prefix url is "/" is main.hbs
app.all('/', function(req, res, next) {
    req.app.locals.layout = 'main';
    next();
});

app.use(async function(req, res, next) {
    req.session.userId === undefined ?
        (res.locals.isLoggedIn = false) :
        (res.locals.isLoggedIn = true);
    switch (req.session.role) {
        case "ADMINSTRATOR":
            res.locals.isAdmin = true;
            res.locals.isSubscriber = false;
            res.locals.isGuest = false;
            res.locals.isEditor = false;
            res.locals.isWriter = false;
            break;
        case "EDITOR":
            res.locals.isEditor = true;
            res.locals.isSubscriber = false;
            res.locals.isGuest = false;
            res.locals.isAdmin = false;
            res.locals.isWriter = false;
            break;
        case "WRITER":
            res.locals.isWriter = true;
            res.locals.isSubscriber = false;
            res.locals.isGuest = false;
            res.locals.isAdmin = false;
            res.locals.isEditor = false;
            break;
        case "SUBSCRIBER":
            res.locals.isSubscriber = true;
            res.locals.isWriter = false;
            res.locals.isGuest = false;
            res.locals.isAdmin = false;
            res.locals.isEditor = false;
            break;
        default:
            res.locals.isGuest = true;
            res.locals.isEditor = false;
            res.locals.isSubscriber = false;
            res.locals.isWriter = false;
            res.locals.isAdmin = false;
    }
    res.locals.userId = req.session.userId;
    res.locals.username = req.session.name;
    res.locals.cat = await catModel.all();
    if(res.locals.isLoggedIn)
    {
        const sub = await subModel.view(res.locals.userId);
        res.locals.avatar = sub[0].avatar;
    }
    next();
});

// Route
app.use('/admin', require('./routes/admin/home.route'));
app.use('/login', require('./routes/login.route'));
app.use('/register', require('./routes/register.route'));
app.use('/confirmation', require('./routes/confirmation.route'));
app.use('/retrieve', require('./routes/reset_password.route'));
app.use('/profile',redirectLogin, require('./routes/profile/profile.route'));

app.get('/logout', function(req, res) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

app.use('/', require('./routes/home.route'));

// Listen Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Server is running at http://localhost:${PORT}`);
});