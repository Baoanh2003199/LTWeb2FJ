const express = require('express');
const memberModel = require('../../models/member.model');
const userModel = require('../../models/user.model');

const route = express.Router();

// Danh sách thành viên
route.get('/', async function(req, res) {
    const list = await memberModel.all();
    res.render('admin/member/home', { member: list });
});

// Thêm thành viên
route.get('/add', function(req, res) {
    res.render('admin/member/add');
});

route.post('/add', async function(req, res) {
    await memberModel.add(req.body);
    res.redirect('admin/member');
});

route.post('/add', async function(req, res) {
    await userModel.add(req.body);
    res.redirect('admin/member');
});

//show user status list option
route.get('/add', async function(req, res) {
    const list = await userModel.all();
    res.render('admin/member/add', { user: list });
});

// Xem chi tiết
route.get('/view/:id', async function(req, res) {
    const id = req.params['id'];
    const list = await memberModel.view(id);
    res.render('admin/member/view', { member: list });
});

//delete
route.post('/delete/:id', async function(req, res) {
    await memberModel.del(req.params.id);
    res.redirect('/admin/member');
});

module.exports = route;