const express = require('express');
const route = express.Router();
const regModel = require('../models/user.model');
const subModel = require('../models/subscriber.model');
const { check, validationResult } = require('express-validator');

route.get('/', function(req, res){

});

route.post('/', async function(req, res){
    
})

module.exports = route;