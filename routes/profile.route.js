const express = require('express');
const route = express.Router();
const userModel = require('../models/user.model');
const subModel = require('../models/subscriber.model');
const memModel = require('../models/member.model');
const roleModel = require('../models/role.model');
const { check, validationResult } = require('express-validator');
const DATE_FORMATER = require( 'dateformat' );


route.get('/',async function(req, res){
    const subRes = await subModel.view(res.locals.userId);
    const user = await userModel.view(res.locals.userId);
    const roleRes = await roleModel.single(user[0].roleId)
    const obj = {
        username: user[0].username,
        name: subRes[0].name,
        dob: DATE_FORMATER( subRes[0].dob, "dd/mm/yyyy"),
        email: subRes[0].email,
        phone: subRes[0].phone,
        expired: subRes[0].expired,
        role: roleRes[0].name
    }
    res.render('profile/personal_infor',{user: obj});
});

route.post('/', async function(req, res){

})

module.exports = route;