const express = require('express');
const route = express.Router();

route.get('/',function(req, res){
    res.render('profile/post_management')
});

module.exports = route;