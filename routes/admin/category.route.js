const express = require('express');
const catModel = require('../../models/category.model')

const route = express.Router();

// Danh sách thể loại
route.get('/',async function(req, res){
    const list = await catModel.all();
    res.render('admin/category/home',{cat: list, empty: list.length === 0});
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