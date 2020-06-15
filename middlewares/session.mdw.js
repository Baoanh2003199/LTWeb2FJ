const session = require("express-session");


module.exports = function (app) {
    app.set('trust proxy', 1) 
    app.use(session({
      secret: 'news_Key',
      resave: false,
      saveUninitialized: true,
      cookie: {
        
      }
    }))
};