const express = require('express');
const memberModel = require('../../models/member.model');

const route = express.Router();

// Danh sách thành viên
route.get('/', async function(req, res) {
    const list = await memberModel.all();
    res.render('admin/member/home', { member: list });
});

// Thêm thành viên
route.get('/add', function(req, res) {
    return res.render('admin/member/add');
});

// Xem chi tiết
route.get('/view/:id', function(req, res) {
    const id = req.params['id'];

    return res.render('admin/member/view');
});

module.exports = route;