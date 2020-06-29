const express = require('express');
const subscriberModel = require('../../models/subscriber.model');

const route = express.Router();

//list all
route.get('/', async function(req, res) {
    const list = await subscriberModel.all();
    res.render('admin/subscriber/home', { sub: list });
});

route.get('/check', function(req, res) {
    return res.render('admin/subscriber/check');
});

route.post('/delete/:id', async function(req, res) {
    const id = req.params.id;
    await subscriberModel.del(id);
    res.redirect('/admin/subscriber');
});

module.exports = route;