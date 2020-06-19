const express = require('express');

const route = express.Router();

// Danh sách thể loại
route.get('/', function(req, res){
    res.render('admin/category/home');
})
// Thêm thể loại
route.get('/add', function(req, res){
    res.render('admin/category/add');
})
// Sửa thể loại theo id 
route.get('/edit/:id', function(req, res){
    // 
    const id = req.params['id'];

    res.render('admin/category/edit');
})
// Xem chi tiết 
route.get('/view/:id', function(req, res){
    const id = req.params['id'];

    res.render('admin/category/view');
})
module.exports = route;