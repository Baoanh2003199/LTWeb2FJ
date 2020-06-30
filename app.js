const express = require("express");
const path = require('path');

const app = express();

app.use(express.urlencoded({
  extended: true
}));

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
require('./middlewares/passport.mdw')(app);

// Set Public path for asset
app.use(express.static(path.join(__dirname, '/public')));

// Set Layout prefix url is "/admin" is admin.hbs
app.all('/admin*', function(req, res, next){
  req.app.locals.layout = 'admin';
  next();
})
// Set Layout prefix url is "/" is main.hbs
app.all('/', function(req, res, next){
  req.app.locals.layout = 'main';
  next();
})


app.use( async function(req,res, next){
  req.session.userId === undefined?res.locals.isLoggedIn=false: res.locals.isLoggedIn=true;
  res.locals.userId = req.session.userId;
  res.locals.username = req.session.name;
  res.locals.cat = await catModel.all();
  next();
})


// Route
app.use('/admin', require('./routes/admin/home.route'));
app.use('/login', require('./routes/login.route'));
app.use('/register', require('./routes/register.route'));


app.get('/logout', function(req,res){
  if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
})

app.get('/',function (req, res) {
    res.render('home/home');
});

// Listen Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
})
