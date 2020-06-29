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
            subject: '[Tin tức 14] Xác minh địa chỉ email của bạn',
            html: 'Xin chào, đây là thư tự động vui lòng không gửi lại. Nhấn vào <a href="http://tintuc14.herokuapp.com"> đây </a> để xác minh email của bạn.'
        });
        //transporter.sendMail({from: 'Tin Tức 14 <tintuc14web@gmail.com>', to:`${req.body.email}`, subject: 'Xác minh địa chỉ email của bạn',text: `Xin chào ${req.body.username}, đây là thư giả lập được gửi từ trang https://tintuc14.herokuapp.com`});
        delete req.body.email
        console.log(req.body);
        await regModel.regAdd(req.body);
        res.redirect('/login');
        
    }
  })

  module.exports = route;