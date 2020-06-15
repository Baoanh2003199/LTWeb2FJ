const express = require('express');

const routes = express.Router();

routes.get('/', function(req, res){
    return res.render('admin/home/home', {layout:'admin'});
})

module.exports = routes;