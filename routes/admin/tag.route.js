const express = require('express');

const route = express.Router();

// Danh sách tag
route.get('/', function(req, res){
    return res.render('admin/tag/home');
});
// Thêm tag
route.get('/add', function(req, res){
    return res.render('admin/tag/add');
});
// Sửa tag
// Get id để tìm model rồi lấy ra để gán vào view
route.get('/edit/:id', function(req, res){
    const id = req.params['id'];
    
    return res.render('admin/tag/edit');
});
module.exports = route;