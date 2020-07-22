const express = require('express');
const subscriberModel = require('../../models/subscriber.model');
const DATE_FORMATER = require('dateformat');
const route = express.Router();

//list all
route.get('/', async function(req, res) {
    const list = await subscriberModel.allSubscriber();
    list.forEach(subscriber => { 
        subscriber.dob = DATE_FORMATER(subscriber.dob, 'dd/mm/yyyy'),
        subscriber.expired = DATE_FORMATER(subscriber.expired, 'HH:MM:ss - dd/mm/yyyy')
      }); 
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