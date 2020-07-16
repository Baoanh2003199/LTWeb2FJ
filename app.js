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

app.use(express.static(path.join(__dirname, '/public')));

const redirectLogin = (req, res, next)=>{
    if(!res.locals.isLoggedIn)
    {
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
    switch (req.session.roleId) {
        case 1:
            res.locals.isAdmin = true;
            break;
        case 11:
            res.locals.isEditor = true;
            break;
        case 21:
            res.locals.isWriter = true;
            break;
        case 31:
            res.locals.isSubscriber = true;
            break;
        default:
            res.locals.isGuest = true;
    }
    res.locals.userId = req.session.userId;
    res.locals.username = req.session.name;
    res.locals.cat = await catModel.all();
    next();
});

// Route
app.use('/admin', require('./routes/admin/home.route'));
app.use('/login', require('./routes/login.route'));
app.use('/register', require('./routes/register.route'));
app.use('/confirmation', require('./routes/confirmation.route'));
app.use('/retrieve', require('./routes/reset_password.route'));
app.use('/profile',redirectLogin, require('./routes/profile.route'));

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