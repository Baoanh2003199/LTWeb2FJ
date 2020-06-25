const bodyParser = require('body-parser');

module.exports = function (app) {
  bodyParser.urlencoded({extended : false})
  app.use(bodyParser.json())
}