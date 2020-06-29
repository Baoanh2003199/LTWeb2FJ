const express = require('express');
const tagModel = require('../../models/tag.model');
const route = express.Router();

// Danh sách tag
route.get('/', async function(req, res) {
    const list = await tagModel.all();
    res.render('admin/tag/home', { tag: list, empty: list.length === 0 });
});
// Thêm tag
route.get('/add', function(req, res) {
    return res.render('admin/tag/add');
});
route.post('/add', async function(req, res) {
    await tagModel.add(req.body);
    res.redirect('/admin/tag');
});
// Sửa tag
// Get id để tìm model rồi lấy ra để gán vào view
route.get('/edit/:id', function(req, res) {
    const id = req.params['id'];

    return res.render('admin/tag/edit');
});
route.get('/view/:id', function(req, res) {
    const id = req.params['id'];

    return res.render('admin/tag/view');
});
module.exports = route;