const express = require('express');
const tokenModel = require('../models/register_Token.model');
const userModel = require('../models/user.model');

const route = express.Router();


route.get('/account/:id', async function(req, res) {
    const token = req.params.id;
    if(token == -1)
    {
        res.render('register_confirm',{status: "không thành công", isSuccess:false})
    }
    else
    {
        const result = await tokenModel.byToken(token);
        if(result[0])
        {
            if(result[0].expired > new Date(Date.now()))
            {
                const user = await userModel.view(result[0].userId);
                user[0].status = 1;
                await userModel.update(user[0]);
                await tokenModel.del(result[0].id);
                res.render('register_confirm',{status: "thành công", isSuccess:true});
            }
            else
            {
                res.render('register_confirm',{status: "không thành công", isSuccess:false})
            }
            
        }
        else
        {
            res.render('register_confirm',{status: "không thành công", isSuccess:false})
        }
    }
});

module.exports = route;