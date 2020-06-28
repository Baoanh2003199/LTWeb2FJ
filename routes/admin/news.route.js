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
// Thêm bài viết
// Lấy id tìm model rồi gán vào views
route.get('/edit/:id', function(req, res) {
    const id = req.params['id'];

    return res.render('admin/news/edit');
});
// Duyệt bài
route.get('/check', function(req, res) {
    const id = req.params['id'];

    return res.render('admin/news/check');
});
// Xem chi tiết
route.get('/view/:id', function(req, res) {
    const id = req.params['id'];

    res.render('admin/news/view');
});
module.exports = route;