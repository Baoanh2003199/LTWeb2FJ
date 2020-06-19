const express = require('express');

const route = express.Router();

// Danh sách thành viên
route.get('/', function(req, res){
    return res.render('admin/member/home');
})
// Thêm thành viên
route.get('/add', function(req, res){
    return res.render('admin/member/add');
})
// Xem chi tiết
route.get('/view/:id', function(req, res){
    const id = req.params['id'];

    return res.render('admin/member/view');
})

module.exports = route;