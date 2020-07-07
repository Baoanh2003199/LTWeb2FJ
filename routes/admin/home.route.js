const express = require('express');
const homeModel = require('../../models/home.model');

const routes = express.Router();

routes.get('/', async function(req, res) {
    const ListUser = await homeModel.CountUsers();
    //const ListView = await homeModel.CountViews();
    const ListNews = await homeModel.CountNews;
    res.render('admin/home/home', {
        user: ListUser,
        new: ListNews,
    });
});

// Route category
routes.use('/category', require('./category.route'));
// Route Tag
routes.use('/tag', require('./tag.route'));
// Route News
routes.use('/news', require('./news.route'));
// Route member
routes.use('/member', require('./member.route'));
// Route subscriber
routes.use('/subscriber', require('./subscriber.route'));

module.exports = routes;