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
app.use(express.static(path.join(__dirname, '/views/public')));


// Route
app.get('/',function (req, res) {
    res.render('home/home');
});







// Listen Port
const PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
})
