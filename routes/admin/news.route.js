const express = require('express');
const newModel = require('../../models/news.model');
const route = express.Router();

// Danh sách bài viết
route.get('/', async function(req, res) {
    const list = await newModel.all();
    res.render('admin/news/home', { news: list, empty: list.length === 0 });
});
// Thêm bài viết
route.get('/add', function(req, res) {
    return res.render('admin/news/add');
});

route.post('/add', async function(req, res) {});
// Thêm bài viết
// Lấy id tìm model rồi gán vào views
route.get('/edit/:id', function(req, res) {
    const id = req.params['id'];

    return res.render('admin/news/edit');
});
// Duyệt bài
route.get('/check/:id', async function(req, res) {
    const id = req.params['id'];
    const list = await newModel.check(id);
    res.render('admin/news/check', { news: list, empty: list.length === 0 });
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