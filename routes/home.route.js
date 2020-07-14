const express = require('express');
const db = require('../utils/db');

const router = express.Router();

router.get('/', function(req, res) {
    res.render('home/home');
});

router.get('/news', function(req, res) {
    res.render('home/news');
});

router.get('/search', function(req, res) {
    res.render('home/search');
});
module.exports = router;