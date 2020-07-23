const exphbs = require('express-handlebars');

const numeral = require('numeral');


module.exports = function(app){
    app.engine('hbs', exphbs({
        layoutsDir: 'views/_layouts',
        defaultLayout: 'main',
        partialsDir: 'views/_partials',
        extname: '.hbs',
        helpers: require('../utils/handler-helper'),
      }));
      app.set('view engine', 'hbs');
};