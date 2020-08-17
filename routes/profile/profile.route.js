const express = require('express');
const routes = express.Router();
const userModel = require('../../models/user.model');
const subModel = require('../../models/subscriber.model');
const roleModel = require('../../models/role.model');
const { check, validationResult } = require('express-validator');
const DATE_FORMATER = require('dateformat');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const newModel = require('../../models/news.model');
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
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback( /*res.end('Only images are allowed')*/ null, false);
        }
        cb(null, true);
    },
});
const upload = multer({ storage: storage });

routes.get('/', async function(req, res) {
    const subRes = await subModel.byUserId(res.locals.userId);
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
        avatar: subRes[0].avatar,
        nickname: subRes[0].nickname,
    };
    res.render('profile/personal_infor', { user: obj });
});

routes.post('/', upload.single('avatar'), async function(req, res) {
    const sObj = await subModel.view(res.locals.userId);
    const nick = null;
    if (!req.file) { // khi không chọn file để upload hay thay đổi avatar thì lấy avatar cũ
        var path = './public/avatar/' + sObj[0].avatar;// tìm file trong folder avatar trên nơi lưu trữ ảnh
        var avatarname = 'default.png'; // nếu không có ảnh thì ảnh mặc định sẽ là default.png
        fs.access(path, fs.F_OK, (err) => { // kiểm tra avatar với tên được truy vấn từ subscriber có tồn tại trong chỗ lưu trữ hay k
            if (!err) {
                avatarname = sObj[0].avatar; // nếu có file tồn tại với tên được truy vấn thì gán avatarname = tên file vừa dc truy vấn
            }
        });
        if (res.locals.isWriter) {
            const subQuery = await subModel.byNickname(req.body.nickname);
            if (!subModel) {
                const entity = {
                    id: sObj[0].id,
                    email: sObj[0].email,
                    name: req.body.name,
                    phone: req.body.phone,
                    dob: req.body.dob,
                    userID: sObj[0].userID,
                    avatar: avatarname,
                    expired: sObj[0].expired,
                    nickname: req.body.nickname,
                };
                const succes = await subModel.update(entity);
                if (succes) {
                    res.render('profile/personal_infor');
                }
            } else {
                res.render('profile/personal_infor', { nicknameExists: true });
            }
        } else {
            const entity = {
                id: sObj[0].id,
                email: sObj[0].email,
                name: req.body.name,
                phone: req.body.phone,
                dob: req.body.dob,
                userID: sObj[0].userID,
                avatar: avatarname,
                expired: sObj[0].expired,
                nickname: '',
            };
            const succes = await subModel.update(entity);
            if (succes) {
                res.render('profile/personal_infor');
            }
        }
    } else {
        sharp(req.file.path)
            .resize(200, 240) // resize ảnh lại thành 200x240
            .toFile(
                './public/avatar/' + '200x240-' + req.file.filename, //đổi tên file thành 200x240 + tên file
                async function(err) {
                    if (err) {
                        console.error('sharp>>>', err);
                    }
                    if (sObj[0].avatar != 'default.png') { // nếu file avatar hiện tại k phải là default.png thì xóa ảnh cũ trong database khi thay đổi
                        fs.unlink('./public/avatar/' + sObj[0].avatar, function(err) {
                            if (err) throw err;
                        });
                    }
                    fs.unlink('./public/avatar/' + req.file.filename, function(err) { // xóa ảnh vừa upload, chỉ lấy ảnh vừa được copy ra từ ảnh vừa upload với tên 200x240 + tên file
                        if (err) throw err;
                    });
                    if (res.locals.isWriter) {
                        const subQuery = await subModel.byNickname(req.body.nickname);
                        if (!subModel) {
                            const entity = {
                                id: sObj[0].id,
                                email: sObj[0].email,
                                name: req.body.name,
                                phone: req.body.phone,
                                dob: req.body.dob,
                                expired: sObj[0].expired,
                                userID: sObj[0].userID,
                                avatar: '200x240-' + req.file.filename,
                                nickname: req.body.nickname,
                            };
                            const succes = await subModel.update(entity);
                            if (succes) {
                                res.render('profile/personal_infor');
                            }
                        } else {
                            res.render('profile/personal_infor', { nicknameExists: true });
                        }
                    } else {
                        const entity = {
                            id: sObj[0].id,
                            email: sObj[0].email,
                            name: req.body.name,
                            phone: req.body.phone,
                            dob: req.body.dob,
                            expired: sObj[0].expired,
                            userID: sObj[0].userID,
                            avatar: '200x240-' + req.file.filename,
                            nickname: '',
                        };
                        const succes = await subModel.update(entity);
                        if (succes) {
                            res.render('profile/personal_infor');
                        }
                    }
                }
            );
    }
});

// Xem chi tiết
routes.get('/view/:id', async function(req, res) {
    const id = req.params.id;
    const list = await newModel.view(id);
    res.render('admin/news/view', { news: list, empty: list.length === 0 });
});

//xoa bai biet
routes.post('/delete/:id', async function(req, res) {
    const id = req.params.id;
    await newModel.del(id);
    res.redirect('/admin/news');
});

// Lấy id tìm model rồi gán vào views
routes.get('/edit/:id', async function(req, res) {
    const id = req.params.id;
    const rows = await newModel.view(id);
    const tagRow = await tagModel.all();
    const catRow = await catModel.all();
    const news = rows[0];
    if (rows.length === 0) return res.send('Invalid parameter.');
    res.render('admin/news/edit', { news, tag: tagRow, cat: catRow });
});

routes.post('/edit', upload.single('thumbnail'), async function(req, res) {
    if (req.file) {
        const entity = {
            name: req.body.name,
            catID: req.body.catID,
            isPremium: req.body.isPremium,
            thumbnail: req.file.filename,
            content: req.body.content,
            openTime: req.body.openTime,
            description: req.body.description,
        };
        const result = await newModel.update(entity);
        await news_tagModel.del(result.insertId);
        const tags = req.body.tagID;
        const nuevo = tags.map((i) => Number(i, 10));
        for (i = 0; i < nuevo.length; i++) {
            const entitys = {
                newID: result.insertId,
                tagID: nuevo[i],
            };
            await news_tagModel.insert(entitys);
        }
    }

    res.redirect('/admin/news');
});

routes.use('/changepassword', require('./change_password.route'));
routes.use('/postmanagement', require('./post_management.route'));
routes.use('/premiumrequest', require('./premium_request.route'));

module.exports = routes;