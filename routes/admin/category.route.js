const express = require('express');
const catModel = require('../../models/category.model');

const route = express.Router();

// Danh sách thể loại
route.get('/', async function(req, res) {
    const list = await catModel.all();
    res.render('admin/category/home', { cat: list, empty: list.length === 0 });
});
// Thêm thể loại
route.get('/add', function(req, res) {
    res.render('admin/category/add');
});

route.post('/add', async function(req, res) {
    await catModel.add(req.body);
    res.redirect('admin/category');
});

// Sửa thể loại theo id
route.get('/edit/:id', async function(req, res) {
    //
    const id = req.params['id'];

    const rows = await catModel.view(id);
    if (rows.length === 0) return res.send('Invalid parameter.');

    const category = rows[0];

    res.render('admin/category/edit', { category });
});

//delete
route.post('/delete/:id', async function(req, res) {
    await catModel.del(req.body.id);
    res.redirect('/admin/category');
});
// Xem chi tiết
route.get('/view/:id', async function(req, res) {
    const id = req.params['id'];
    const list = await catModel.view(id);
    res.render('admin/category/view', { cat: list, empty: list.length === 0 });
});
module.exports = route;