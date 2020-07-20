const express = require('express');
const userModel = require('../../models/user.model');

const route = express.Router();

route.get('/', function(req, res)
{
    res.render('profile/change_password');
});

route.post('/', async function(req, res)
{

});

module.exports = route;