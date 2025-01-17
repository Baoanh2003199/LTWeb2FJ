const express = require('express');
const catModel = require('../../models/category.model');
const tagModel = require('../../models/tag.model');
const { session } = require('passport');

const route = express.Router();

// Danh sách thể loại
route.get('/', async function(req, res) {
    const list = await catModel.all();
    return res.render('admin/category/home', {
        cat: list,
        empty: list.length === 0,
    });
});

// Thêm thể loại
route.get('/add', async function(req, res) {
    const tag = await catModel.nameCategory();
    res.render('admin/category/add', { list: tag });
});

route.post('/add', async function(req, res) {
    await catModel.add(req.body);
    res.redirect('/admin/category');
});

// Sửa thể loại theo id
route.get('/edit/:id', async function(req, res) {
    const id = +req.params['id'] || -1;
    const rows = await catModel.view(id);
    const tag = await catModel.nameCategory();
    if (rows.length === 0) return res.send('Invalid parameter.');
    const category = rows[0];
    res.render('admin/category/edit', { category, tag: tag });
});

route.post('/update', async function(req, res) {
    await catModel.update(req.body);
    res.redirect('/admin/category');
});

//delete
route.post('/delete/:id', async function(req, res) {
    await catModel.del(req.params.id);
    res.redirect('/admin/category');
});
// Xem chi tiết
route.get('/view/:id', async function(req, res) {
    const id = req.params.id;
    const list = await catModel.view(id);
    res.render('admin/category/view', { cat: list, empty: list.length === 0 });
});
route.post('/edit/:id', async function(req, res){
    const id = req.body.id;
    const result = await catModel.update(req.body);

   
    if(result.changedRows != 0){
        res.locals.success = "Sửa chuyên mục thành công";
    }else{
        res.locals.errors = "vui lòng kiểm tra lại dữ liệu";
    }
    return res.redirect(`/admin/category/edit/${id}`);
});
module.exports = route;