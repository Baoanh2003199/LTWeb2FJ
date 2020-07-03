const express = require('express');
const newModel = require('../../models/news.model');
const tagModel = require('../../models/tag.model');
const upload = require('../../utils/uploadFile');
const catModel = require('../../models/category.model');
const news_tagModel = require('../../models/news_tag.model');
const list = require('../../utils/array');
const route = express.Router();

// Danh sách bài viết
route.get('/', async function(req, res) {
    const list = await newModel.all();
    res.render('admin/news/home', { news: list, empty: list.length === 0 });
});
// Thêm bài viết
route.get('/add', async function(req, res) {
    const tagRow = await tagModel.all();
    const catRow = await catModel.all();
    res.render('admin/news/add', { tag: tagRow, cat: catRow });
});
//mo cai notepad
route.post('/add', async function(req, res) {
    const tagIDs = [req.body.tagID];
    const entity = {
        name: req.body.name,
        catID: req.body.catID,
        isPremium: req.body.isPremium,
        tagID: list.array(tagIDs),
        filePdf: upload.uploadFile(req.body.filePdf),
        content: req.body.content,
        openTime: req.body.openTime,
    };
    await newModel.add(entity);
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

route.post('/edit', async function(req, res) {
    await newModel.update(req.body);
    const tagIDs = [req.body.tagID];
    const entity = {
        newID: req.body.id,
        tagID: list.array(tagIDs),
    };
    await news_tagModel.insert(entity);
    res.redirect('/admin/news');
});
// Duyệt bài
route.get('/check', async function(req, res) {
    const list = await newModel.check();
    res.render('admin/news/check', { news: list, empty: list.length === 0 });
});
route.post('/check/:id/:status', async function(req, res) {
    const num = req.params.num;
    entity = {
        check: req.params.status,
        id: req.params.id,
    };
    if (num == 1) {
        entity.check = 1;
        await newModel.update(entity);
    } else {
        entity.check = 0;
        await newModel.update(entity);
    }
    es.redirect('/admin/news/check');
});
// Xem chi tiết
route.get('/view/:id', async function(req, res) {
    const id = req.params['id'];
    const list = await newModel.view(id);
    res.render('admin/news/view', { news: list, empty: list.length === 0 });
});
module.exports = route;

//xoa bai biet
route.post('/delete/:id', async function(req, res) {
    const id = req.params['id'];
    await newModel.del(id);
    res.redirect('/admin/news');
});