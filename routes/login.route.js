const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');


route.get('/', redirectHome, function(req,res){
    res.render('login');
})


module.exports = route;