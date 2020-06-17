const express = require('express')

const route = express.Router();

// Danh sách bài viết
route.get('/', function(req, res){
    return res.render('admin/news/home')
});
// Thêm bài viết
route.get('/add', function (req, res) {
    return res.render('admin/news/add')
})
// Thêm bài viết
// Lấy id tìm model rồi gán vào views
route.get('/edit/:id', function (req, res) {
    const id = req.params['id'];

    return res.render('admin/news/edit')
})
module.exports = route;