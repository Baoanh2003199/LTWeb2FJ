const express = require('express');
const newModel = require('../models/home.model');
const catModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function(req, res) {
    const resultCat = await catModel.allSubCategory();
    for (i = 0; i < resultCat.length; i++) {
        const catID = resultCat[i].id;
        const resultNewCatMuch = await newModel.CatToNews(catID);
        const resultManyToCatMuch = await newModel.ManyToNews(catID);
        resultCat[i].news = resultNewCatMuch;
        resultCat[i].new = resultManyToCatMuch;
    }
    return res.render('home/home', {
        resultCat: resultCat,
    });
});

router.get('/:name/baiviet=/:id', async function(req, res) {
    const name = req.params.name;
    const id = req.params.id;
    const list = await newModel.NewsDetail(name, id);
    res.render('home/news', { list: list });
});

router.get('/search', function(req, res) {
    res.render('home/search');
});
module.exports = router;