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

module.exports = route;