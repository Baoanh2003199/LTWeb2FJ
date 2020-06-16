const express = require('express');


const routes = express.Router();

routes.get('/', function(req, res){
    return res.render('admin/home/home');
})

routes.use('/category', require('./category.route'));

module.exports = routes;