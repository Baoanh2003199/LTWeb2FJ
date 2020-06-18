const express = require('express');


const routes = express.Router();

routes.get('/', function(req, res){
    return res.render('admin/home/home');
})

// Route category
routes.use('/category', require('./category.route'));
// Route Tag
routes.use('/tag', require('./tag.route'));
// Route News
routes.use('/news', require('./news.route'));
// Route member
routes.use('/member', require('./member.route'));

module.exports = routes;