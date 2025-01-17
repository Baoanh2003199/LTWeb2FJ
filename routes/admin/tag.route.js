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
    const id = req.params.id;
    const rows = tagModel.view(id);
    if (rows.length === 0) return res.send('Invalid parameter.');
    const tag = rows[0];
    res.render('admin/tag/edit', { tag });
});

//update
route.post('/update', async function(req, res) {
    await tagModel.update(req.body);
    res.redirect('/admin/tag');
});

route.get('/view/:id', async function(req, res) {
    const id = req.params['id'];
    const list = await tagModel.view(id);
    res.render('admin/tag/view', { tag: list });
});

route.post('/delete/:id', async function(req, res) {
    const id = req.params.id;
    await tagModel.del(id);
    res.redirect('/admin/tag');
});
module.exports = route;