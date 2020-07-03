const express = require('express');
const route = express.Router();
const regModel = require('../models/user.model');
var mailer = require('../utils/mailer');
const { check, validationResult } = require('express-validator');


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

route.post('/', [
    check('username', 'Tên người dùng không được rỗng').not().isEmpty(),
    check('username', 'Tên người dùng phải chỉ được dùng chữ và số').isAlphanumeric(),
    check('username', 'Tên người dùng phải hơn 6 kí tự').isLength({ min: 6 }),
    check('email', 'Email không được rỗng').not().isEmpty(),
    check('email', 'Email không hợp lệ').isEmail(),
    //check('phone', 'Invalid phone').isNumeric(),
    check('password', 'Mật khẩu phải hơn 6 kí tự').isLength({ min: 6 }),
    check('terms', 'Bạn chưa đồng ý với điều khoản').not().isEmpty()
  ], async function (req, res){

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('register', {Error: errors.array(), noError: errors.array().length == 0});
        //return res.status(422).json({ errors: errors.array() })
    }
    else
    {
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
    }
    
  })

  module.exports = route;