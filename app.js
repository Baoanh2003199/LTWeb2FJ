const express = require("express");
const path = require('path');

const app = express();

// Include MiddleWare
// - View: Config for view handlebars
require('./middlewares/views.mdw')(app);
// - Session: Config for session 
require('./middlewares/session.mdw')(app);
// - Locals: Set local Variable 
require('./middlewares/locals.mdw')(app);

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




// Route
app.use('/admin', require('./routes/admin/home.route'));

app.get('/register',function (req, res) {
  res.render('register');
});

app.get('/login',function (req, res) {
  res.render('login');
});



app.get('/',function (req, res) {
    res.render('home/home');
});

// Listen Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
})
