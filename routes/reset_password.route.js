const express = require('express');
const route = express.Router();
const rsModel = require('../models/reset_password.model');
const userModel = require('../models/user.model');
const subModel = require('../models/subscriber.model');
var mailer = require('../utils/mailer');



function randomString() {
    var result = '';
    var length = 9;
    var chars = '0123456789';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

route.get('/', function(req, res){
res.render('reset_password');
})

route.post('/', async function (req, res)
{
    const result = await userModel.byName(req.body.username);
    const usrid = result[0].id;
    if(usrid)
    {
        const subscriber = await subModel.view(usrid);
        if(subscriber)
        {
            const name = subscriber[0].name;
            const record = {
                email = subscriber[0].email,
                token_reset = randomString()
            } 
            await reset_password.add(record);
            mailer.send({
                from: 'tintuc14web@gmail.com',
                to: `${record.email}`,
                subject: 'Khôi phục mật khẩu',
                html: `
                Xin chào ${name}, bạn đã gửi yêu cầu khôi phục mật khẩu.
                <br> 
                Xin hãy nhập những kí tự bên dưới vào trang xác nhận để khôi phục lại mật khẩu: <br>
                <label style="font-weight:bold>${record.token_reset}</lable><br>
                Mã xác nhận có hiệu lực trong vòng 24h, xin hãy xác nhận trước khi hết hạn.
                <br>
                (Đây là thư tự động vui lòng không phản hồi)
                `
            });
        }
        else
        {
            res.render('reset_password',{isNotExists: true});
        }
    }
    else
    {
        res.render('reset_password',{isNotExists: true});
    }

})


module.exports = route;