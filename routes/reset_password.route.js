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
});

route.post('/', async function (req, res)
{
    const result = await userModel.byName(req.body.username);
    if(result[0] != undefined)
    {
        const usrid = result[0].id;
        if(usrid) 
        {
            const subscriber = await subModel.view(usrid);
            if(subscriber != undefined)
            {
                const name = subscriber[0].name;
                const rsRecord = rsModel.byEmail(subscriber[0].email);
                if(rsRecord[0].sent_times < 3)
                {
                    const record = {
                        email : subscriber[0].email,
                        token_reset : randomString(),
                        expired: new Date(Date.now() + 1 * 86400000),
                        sent_times: rsRecord[0].sent_times + 1
                    }; 
                    await rsModel.add(record);
                    /*mailer.send({
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
                        (Đây là thư tự động vui lòng không phản hồi)
                        `
                    });*/
                    res.redirect('/retrievepassword/confirm');
                }
                else{
                    res.render('reset_password',{OutOfSend: true});
                }
                
        }
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

});

route.get('/confirm', function (req, res)
{
res.render('reset_confirm')
});

route.post('/confirm', function (req, res)
{
   
});

route.get('/resend', function(req, res){

});


route.post('/resend', function(req, res){

});


module.exports = route;