const bodyParser = require('body-parser');

module.exports = function (app) {
  bodyParser.urlencoded({extended : true})
  app.use(bodyParser.json())
};