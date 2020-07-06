const express = require('express');
const newModel = require('../../models/news.model');
const tagModel = require('../../models/tag.model');
const catModel = require('../../models/category.model');
const news_tagModel = require('../../models/news_tag.model');
const list = require('../../utils/array');
const route = express.Router();
const multer = require('multer');
const path = require('path');

// Danh sách bài viết
route.get('/', async function(req, res) {
    const list = await newModel.all();
    res.render('admin/news/home', { news: list, empty: list.length === 0 });
});
// Thêm bài viết
route.get('/add', async function(req, res) {
    const tagRow = await tagModel.all();
    // Chổ này lấy tất cả category có parentID != 0 nha Quan sửa lại câu truy vấn
    const catRow = await catModel.getList();
    res.render('admin/news/add', { tag: tagRow, cat: catRow });
});
//mo cai notepad

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    },
});
const upload = multer({ storage: storage }).single('filePdf');
route.post('/add', upload, async function(req, res) {
    //res.send(req.body);
    if (req.file) {
        const entity = {
            name: req.body.name,
            catID: req.body.catID,
            isPremium: req.body.isPremium,
            filePdf: req.file.filePdf,
            content: req.body.content,
            openTime: req.body.openTime,
        };
        console.log(entity);
        // Insert gán vào result
        const result = await newModel.add(entity);
        console.log(`id khi insert thanh cong ${result.insertId}`);
        const tags = [req.body.tagID];
        const i = list.array(tags);
        console.log(parseInt(i, 10));
        const entitys = {
            newID: result.insertId,
            tagID: parseInt(i, 10),
        };
        console.log(entitys);
        await news_tagModel.insert(entitys);
    }
    res.redirect('/admin/news');
});

// Lấy id tìm model rồi gán vào views
route.get('/edit/:id', async function(req, res) {
    const id = req.params['id'];
    const rows = await newModel.view(id);
    const tagRow = await tagModel.all();
    const catRow = await catModel.all();
    const news = rows[0];
    if (rows.length === 0) return res.send('Invalid parameter.');
    res.render('admin/news/edit', { news, tag: tagRow, cat: catRow });
});

route.post('/edit', upload, async function(req, res) {
    if (req.file) {
        const entity = {
            name: req.body.name,
            catID: req.body.catID,
            isPremium: req.body.isPremium,
            filePdf: req.file.filePdf,
            content: req.body.content,
            openTime: req.body.openTime,
        };
        const result = await newModel.update(entity);
        console.log(`id khi insert thanh cong ${result.insertId}`);
        const tags = [req.body.tagID];
        const i = list.array(tags);
        console.log(parseInt(i, 10));
        await news_tagModel.del(result.insertId);
        const entitys = {
            newID: result.insertId,
            tagID: parseInt(i, 10),
        };
        console.log(entitys);
        await news_tagModel.update(entitys);
    }

    res.redirect('/admin/news');
});
// Duyệt bài
route.get('/check', async function(req, res) {
    const list = await newModel.check();
    res.render('admin/news/check', { news: list, empty: list.length === 0 });
});
route.post('/check/:id', async function(req, res) {
    const num = req.params.num;
    entity = {
        id: req.params.id,
        status: req.params.status,
    };
    if (num == '1') {
        await newModel.update(entity);
    } else {
        await newModel.update(entity);
    }
    res.redirect('/admin/news/check');
});
// Xem chi tiết
route.get('/view/:id', async function(req, res) {
    const id = req.params['id'];
    const list = await newModel.view(id);
    res.render('admin/news/view', { news: list, empty: list.length === 0 });
});

//xoa bai biet
route.post('/delete/:id', async function(req, res) {
    const id = req.params['id'];
    await newModel.del(id);
    res.redirect('/admin/news');
});
module.exports = route;