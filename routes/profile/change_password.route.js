const express = require('express');
const userModel = require('../../models/user.model');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const route = express.Router();

route.get('/',function(req, res)
{
    res.render('profile/change_password');
});

route.post('/',[
    check('currpassword', 'Mật khẩu hiện tại phải hơn 6 kí tự').isLength({ min: 6 }),
    check('newpassword', 'Mật khẩu mới phải hơn 6 kí tự').isLength({ min: 6 }).custom((val, { req}) => {
        if (val !== req.body.cnewpassword) {
            throw new Error("Mật khẩu mới và xác nhận mật khẩu mới không khớp");
        }
        else
        {
            return val;
        }
    })
  ],async function(req, res)
{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('profile/change_password', {Error: errors.array(), isError: true });
    }
    else{
        const QueryObj = await userModel.view(res.locals.userId);
        const pw = req.body.currpassword;
        var hashed = QueryObj[0].password;
        var validUser = bcrypt.compareSync(pw, hashed)
        if(validUser)
        {
            const entity={
                id: QueryObj[0].id,
                username: QueryObj[0].username,
                password: req.body.newpassword,
                roleId: QueryObj[0].roleId,
                status: QueryObj[0].status,
            }
            const result = await userModel.hashUpdate(entity);
            if(result)
            {
                res.redirect("/profile");
            }
        }
        else
        {
            res.render('profile/change_password',{wrongPw:true})
        }
    }
});

module.exports = route;