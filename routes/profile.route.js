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
const sharp = require('sharp');
const fs = require("fs");
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
    fileFilter: function(req, file, cb) {
        var ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback( /*res.end('Only images are allowed')*/ null, false)
        }
        cb(null, true)
    }
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
        avatar: subRes[0].avatar
    };
    res.render('profile/personal_infor', { user: obj });
});

route.post('/', upload.single('avatar'), async function(req, res) {
    const sObj = await subModel.view(res.locals.userId);
    console.log(req.body);
    if(!req.file){
        const entity = {
            id: sObj[0].id,
            email: sObj[0].email,
            name: req.body.name,
            phone: req.body.phone,
            dob: req.body.dob,
            userID: sObj[0].userID,
            avatar: sObj[0].avatar,  
        }
        const succes = await subModel.update(entity);
        if(succes)
        {
            res.redirect('/profile');
        }
    }
    else
    {
        sharp(req.file.path).resize(200, 240).toFile('./public/avatar/'+ '200x240-'+req.file.filename, async function(err) {
            if (err) {
                console.error('sharp>>>', err)
            }
            if(sObj[0].avatar != "default.png")
            {
                fs.unlink("./public/avatar/"+sObj[0].avatar, function (err) {
                    if (err) throw err;
                });  
            }
            fs.unlink("./public/avatar/"+req.file.filename, function (err) {
                if (err) throw err;
            }); 
            const entity = {
                id: sObj[0].id,
                email: sObj[0].email,
                name: req.body.name,
                phone: req.body.phone,
                dob: req.body.dob,
                userID: sObj[0].userID,
                avatar: '200x240-'+req.file.filename, 
            }
            const succes = await subModel.update(entity);
            if(succes)
            {
                res.redirect('/profile');
            }
        })
    }

    
});

module.exports = route;