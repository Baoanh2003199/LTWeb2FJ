const express = require('express');

const route = express.Router();

route.get('/', function(req, res){
    return res.render('admin/subscriber/home');
})
route.get('/check', function(req, res){
    return res.render('admin/subscriber/check');
})

module.exports = route;