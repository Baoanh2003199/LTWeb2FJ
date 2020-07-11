const express = require('express');
const route = express.Router();
const regModel = require('../models/user.model');
const subModel = require('../models/subscriber.model');
const tokenModel = require('../models/register_Token.model');
var mailer = require('../utils/mailer');
const { check, validationResult } = require('express-validator');
const TokenGenerator = require('uuid-token-generator');
 


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
    check('username', 'Tên người dùng không được trống').not().isEmpty(),
    check('username', 'Tên người dùng phải chỉ được dùng chữ và số').isAlphanumeric(),
    check('username', 'Tên người dùng phải hơn 6 kí tự').isLength({ min: 6 }),
    check('email', 'Email không được trống').not().isEmpty(),
    check('email', 'Email không hợp lệ').isEmail(),
    check('password', 'Mật khẩu phải hơn 6 kí tự').isLength({ min: 6 }).custom((val, { req}) => {
        if (val !== req.body.cpassword) {
            throw new Error("Mật khẩu không khớp");
        }
        else
        {
            return val;
        }
    }),
    check('dob', 'Ngày sinh không hợp lệ').isISO8601('dd-mm-yyyy'),
    check('phone', 'Số điện thoại không hợp lệ').isNumeric(),
    check('terms', 'Bạn chưa đồng ý với điều khoản').not().isEmpty()
  ], async function (req, res){

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('register', {Error: errors.array(), noError: errors.array().length === 0 });
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
            const usr={
                username: req.body.username,
                password: req.body.password,
                roleId: 31,
                status: 0
            }
            delete req.body.cpassword
            delete req.body.terms
            const registed = await regModel.regAdd(usr);
            if(registed.affectedRows == 1)
            {
                let myDate = new Date(Date.now() + 7 * 86400000);
                const sub={
                    name: req.body.name,
                    email: req.body.email,
                    dob: req.body.dob,
                    phone: req.body.phone,
                    userId: registed.insertId,
                    expired: myDate
                }
                const subscriberAdded = await subModel.add(sub);
                if(subscriberAdded.affectedRows == 1)
                {
                    const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
                    const token = tokgen.generate();
                    let expiredHours = new Date(Date.now() + 1 * 86400000);
                    const tokenObj = 
                    {
                        userId: registed.insertId,
                        token: token,
                        expired: expiredHours
                    }
                    await tokenModel.add(tokenObj);
                    mailer.send({
                        from: 'tintuc14web@gmail.com',
                        to: `${sub.email}`,
                        subject: 'Xác minh địa chỉ email của bạn',
                        html: `
                        Xin chào ${sub.name}, cảm ơn bạn đã đăng ký 1 tài khoản ở trang Tin tức 14.
                        <br> 
                        Nhấp vào 
                        <a href="http://tintuc14.heroku.app/confirmation/account/${token}"> đây </a> 
                        để xác minh email của bạn, xin hãy xác minh email của bạn trong vòng 24h.
                        <br>
                        (Đây là thư tự động vui lòng không phản hồi)
                        `
                    });
                    res.redirect(`/`);
                }
                
            }
            
            
        }
    }
    
  })

  module.exports = route;