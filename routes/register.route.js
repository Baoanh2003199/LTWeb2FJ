const express = require('express');
const route = express.Router();
const regModel = require('../models/user.model');


const redirectHome = (req, res, next)=>{
    if(res.locals.isLoggedIn)
    {
        res.redirect('/');
    }
    else
    {
        next();
    }
}

route.get('/', redirectHome, function (req, res) {
    res.render('register')

})

route.post('/', async function (req, res) {
    const result = await regModel.byName(req.body.username);
    if(result[0])
    {
        res.render('register', {isExists: true})
    }
    else
    {
        await regModel.regAdd(req.body);
        res.redirect('/login')
    }
  })

  module.exports = route;