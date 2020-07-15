const express = require('express');
const route = express.Router();
const regModel = require('../models/user.model');
const subModel = require('../models/subscriber.model');
const memModel = require('../models/member.model');
const { check, validationResult } = require('express-validator');

route.get('/', function(req, res){
    res.render('profile/home');
});

route.post('/', async function(req, res){

})

module.exports = route;