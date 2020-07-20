const express = require('express');
const route = express.Router();
const rsModel = require('../models/reset_password.model');
const userModel = require('../models/user.model');
const subModel = require('../models/subscriber.model');
var mailer = require('../utils/mailer');
const { check, validationResult } = require('express-validator');


const restrict = (req, res, next)=>{
    if(req.session.available_pwtoken)
    {
        next();
    }
    else
    {
        res.redirect('/');
    }
}


route.get('/', function(req, res){
res.render('reset_password');
});

route.post('/', async function (req, res)
{
    handler(req, res, 'reset_password');
});

route.get('/verify', function (req, res)
{
res.render('reset_confirm');
});

route.post('/verify',async function (req, res)
{
    const result = await rsModel.byToken(req.body.pwtoken)
    if(result[0])
    {
        req.session.available_pwtoken = true;
        const sub = await subModel.byEmail(result[0].email);
        if(sub[0])
        {
            req.session.changepw_usrid = sub[0].userID;
            res.redirect('/retrieve/newpassword');
        }
        else
        {
            res.render('reset_confirm',{isNotExists: true});
        }

    }
    else
    {
        res.render('reset_confirm',{isNotExists: true});
    }
});

route.get('/newpassword', restrict, function (req, res){
    res.render('reset_newpw');
});

route.post('/newpassword',[
    check('newpassword', 'Mật khẩu phải hơn 6 kí tự').isLength({ min: 6 }).custom((val, { req}) => {
        if (val !== req.body.cnewpassword) {
            throw new Error("Mật khẩu không khớp");
        }
        else
        {
            return val;
        }
    }),
  ], async function(req, res)
{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('reset_newpw', {Error: errors.array(), isError: true });
    }
    else
    {

        const queryEntity = await userModel.view(req.session.changepw_usrid);
        entity = {
            id: queryEntity[0].id,
            username: queryEntity[0].username,
            password: req.body.newpassword,
            roleId: queryEntity[0].roleId,
            status: queryEntity[0].status
        }
        const result = await userModel.hashUpdate(entity);
        console.log("result of update: "+ result);
        if(result)
        {
            res.redirect('/login');
        }
    }
})

function randomString() {
    var result = '';
    var length = 9;
    var chars = '0123456789';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}


async function handler(req, res, view)
{
    const result = await userModel.byName(req.body.username);
    if(result[0] != undefined)
    {
        re_usrname = result[0].username;
        const usrid = result[0].id;
        if(usrid) 
        {
            const subscriber = await subModel.view(usrid);
            if(subscriber[0] != undefined)
            {
                const name = subscriber[0].name;
                const rsRecord = await rsModel.byEmail(subscriber[0].email);
                if(rsRecord[0] != undefined)
                {
                    if(rsRecord[0].sent_time < 3 && rsRecord[0].available_time <= new Date(Date.now()))
                    {
                        if(rsRecord[0].sent_time == 2)
                        {
                            const record = {
                                id: rsRecord[0].id,
                                email : subscriber[0].email,
                                token_reset : randomString(),
                                expired: new Date(Date.now() + 1 * 86400000),
                                sent_time: rsRecord[0].sent_time + 1,
                                available_time: new Date(Date.now() + 1 * 86400000)
                            }; 
                            await rsModel.update(record);
                            mailer.send({
                                from: 'tintuc14web@gmail.com',
                                to: `${record.email}`,
                                subject: 'Khôi phục mật khẩu',
                                html: `
                                Xin chào <label style="font-weight:bold">${name}</label>, bạn đã gửi yêu cầu khôi phục mật khẩu.
                                <br> 
                                Xin hãy nhập mã xác nhận bên dưới vào trang xác nhận để khôi phục lại mật khẩu: <br>
                                <label style="font-weight:bold">${record.token_reset}</label> 
                                <br>
                                Mã xác nhận có hiệu lực trong vòng 24h, xin hãy xác nhận trước khi hết hạn
                                <br>
                                Nếu bạn không yêu cầu khôi phục mật khẩu, xin vui lòng bỏ qua thư này.
                                (Đây là thư tự động vui lòng không phản hồi).
                                `
                            });
                            res.redirect('/retrieve/verify');
                        }
                        else
                        {
                            const record = {
                                id: rsRecord[0].id,
                                email : subscriber[0].email,
                                token_reset : randomString(),
                                expired: new Date(Date.now() + 1 * 86400000),
                                sent_time: rsRecord[0].sent_time + 1,
                                available_time: new Date(Date.now() + 0)
                            }; 
                            await rsModel.update(record);
                            mailer.send({
                                from: 'tintuc14web@gmail.com',
                                to: `${record.email}`,
                                subject: 'Khôi phục mật khẩu',
                                html: `
                                Xin chào <label style="font-weight:bold">${name}</label>, bạn đã gửi yêu cầu khôi phục mật khẩu.
                                <br> 
                                Xin hãy nhập mã xác nhận bên dưới vào trang xác nhận để khôi phục lại mật khẩu: <br>
                                <label style="font-weight:bold">${record.token_reset}</label> 
                                <br>
                                Mã xác nhận có hiệu lực trong vòng 24h, xin hãy xác nhận trước khi hết hạn
                                <br>
                                Nếu bạn không yêu cầu khôi phục mật khẩu, xin vui lòng bỏ qua thư này.
                                (Đây là thư tự động vui lòng không phản hồi).
                                `
                            });
                            res.redirect('/retrieve/verify');
                        }
                        
                    }
                    if(rsRecord[0].sent_time == 3)
                    {
                        if(rsRecord[0].available_time < new Date(Date.now()))
                        {
                            const record = {
                                id: rsRecord[0].id,
                                email : subscriber[0].email,
                                token_reset : randomString(),
                                expired: new Date(Date.now() + 1 * 86400000),
                                sent_time: 0,
                                available_time: new Date(Date.now() + 0)
                            }; 
                            await rsModel.update(record);
                            mailer.send({
                                from: 'tintuc14web@gmail.com',
                                to: `${record.email}`,
                                subject: 'Khôi phục mật khẩu',
                                html: `
                                Xin chào <label style="font-weight:bold">${name}</label>, bạn đã gửi yêu cầu khôi phục mật khẩu.
                                <br> 
                                Xin hãy nhập mã xác nhận bên dưới vào trang xác nhận để khôi phục lại mật khẩu: <br>
                                <label style="font-weight:bold">${record.token_reset}</label> 
                                <br>
                                Mã xác nhận có hiệu lực trong vòng 24h, xin hãy xác nhận trước khi hết hạn
                                <br>
                                Nếu bạn không yêu cầu khôi phục mật khẩu, xin vui lòng bỏ qua thư này.
                                (Đây là thư tự động vui lòng không phản hồi).
                                `
                            });
                            res.redirect('/retrieve/verify');
                        }
                        else
                        {
                            res.render(view,{OutOfSend: true});
                        }
                        
                    }
                }
                else
                {
                    const record = {
                        email : subscriber[0].email,
                        token_reset : randomString(),
                        expired: new Date(Date.now() + 1 * 86400000),
                        sent_time:1,
                        available_time: new Date(Date.now() + 0)
                    }; 
                    await rsModel.add(record);
                    mailer.send({
                        from: 'tintuc14web@gmail.com',
                        to: `${record.email}`,
                        subject: 'Khôi phục mật khẩu',
                        html: `
                        Xin chào <label style="font-weight:bold">${name}</label>, bạn đã gửi yêu cầu khôi phục mật khẩu.
                        <br> 
                        Xin hãy nhập mã xác nhận bên dưới vào trang xác nhận để khôi phục lại mật khẩu: <br>
                        <label style="font-weight:bold">${record.token_reset}</label> 
                        <br>
                        Mã xác nhận có hiệu lực trong vòng 24h, xin hãy xác nhận trước khi hết hạn
                        <br>
                        Nếu bạn không yêu cầu khôi phục mật khẩu, xin vui lòng bỏ qua thư này.
                        (Đây là thư tự động vui lòng không phản hồi).
                        `
                    });
                    res.redirect('/retrieve/verify');
                }
        }
    }
    else
        {
            res.render(view,{isNotExists: true});
        }
    }
    else
    {
        res.render(view,{isNotExists: true});
    }

}

module.exports = route;