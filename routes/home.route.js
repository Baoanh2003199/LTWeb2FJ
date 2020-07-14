const express = require('express');
const db = require('../utils/db');

const router = express.Router();

router.get('/', function(req, res) {
    res.render('home/home');
});

router.get('/news', function(req, res) {
    res.render('home/news');
});
module.exports = router;