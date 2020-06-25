const bodyParser = require('body-parser');

module.exports = function (app) {
  app.use(express.urlencoded({
    extended: true
  }));
};
