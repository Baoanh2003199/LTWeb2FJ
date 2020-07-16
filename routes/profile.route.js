const express = require('express');
const route = express.Router();
const userModel = require('../models/user.model');
const subModel = require('../models/subscriber.model');
const memModel = require('../models/member.model');
const roleModel = require('../models/role.model');
const { check, validationResult } = require('express-validator');
const DATE_FORMATER = require('dateformat');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/avatar/');
    },
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    },
});
const upload = multer({ storage: storage });

route.get('/', async function(req, res) {
    const subRes = await subModel.view(res.locals.userId);
    const user = await userModel.view(res.locals.userId);
    const roleRes = await roleModel.single(user[0].roleId);
    const obj = {
        username: user[0].username,
        name: subRes[0].name,
        dob: DATE_FORMATER(subRes[0].dob, 'yyyy-mm-dd'),
        email: subRes[0].email,
        phone: subRes[0].phone,
        expired: DATE_FORMATER(subRes[0].expired, 'HH:MM:ss - dd/mm/yyyy'),
        role: roleRes[0].name,
    };
    res.render('profile/personal_infor', { user: obj });
});

route.post('/', upload.single('avatar'), async function(req, res) {
    //dung cai nay req.file.filename, de
    //lay ten luu vao cot avarta
});

module.exports = route;