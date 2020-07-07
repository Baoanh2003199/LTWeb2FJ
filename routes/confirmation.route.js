const express = require('express');
const tokenModel = require('../models/register_Token.model');

const route = express.Router();


route.get('/account/:id', async function(req, res) {
    const token = req.params.id;
    console.log("token: "+token);
    if(token == -1)
    {
        res.send('error')
    }
    else
    {
        const result = await tokenModel.byToken(token);
        console.log("result: "+ await tokenModel.byToken(token))
        if(result[0])
        {
            if(result[0].expired < Date.now())
            {
                res.send('email confirmation success !');
            }
            else
            {
                res.send('email confirmation failed !'); 
            }
            
        }
        else
        {
            res.send('email confirmation failed !');
        }
    }
});

module.exports = route;