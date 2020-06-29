const express = require('express');
const route = express.Router();
const regModel = require('../models/user.model');
var nodemailer = require('nodemailer');


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

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tintuc14web@gmail.com',
    pass: 'ruxeegdgsdfepvzn'
  }
});

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
        
        transporter.sendMail({from: 'tintuc14web@gmail.com', to:`${req.body.email}`, subject: 'Xác minh địa chỉ email của bạn',text: `Xin chào ${req.body.username}, đây là thư giả lập được gửi từ trang https://tintuc14.herokuapp.com`});
        delete req.body.email
        console.log(req.body);
        await regModel.regAdd(req.body);
        res.redirect('/login');
        
    }
  })

  module.exports = route;