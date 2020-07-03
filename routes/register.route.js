const express = require('express');
const route = express.Router();
const regModel = require('../models/user.model');
var mailer = require('../utils/mailer');


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
        mailer.send({
            from: 'tintuc14web@gmail.com',
            to: `${req.body.email}`,
            subject: 'Xác minh địa chỉ email của bạn',
            html: 'Xin chào, đây là thư tự động từ tintuc14 vui lòng không gửi lại. Nhấp vào <a href="https://tintuc14.herokuapp.com/login"> đây </a> để xác minh email của bạn.'
        });
        delete req.body.email
        console.log(req.body);
        await regModel.regAdd(req.body);
        res.redirect('/login');
        
    }
  })

  module.exports = route;