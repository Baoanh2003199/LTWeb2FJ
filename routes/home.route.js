const express = require('express');
const newModel = require('../models/home.model');
const catModel = require('../models/category.model');
const range = require('../utils/range');

const router = express.Router();

router.get('/', async function(req, res) {
    const resultCat = await catModel.allSubCategory();
    for (i = 0; i < resultCat.length; i++) {
        const catID = resultCat[i].id;
        const resultNewCatMuch = await newModel.CatToNews(catID);
        const resultManyToCatMuch = await newModel.ManyNews(catID);
        resultCat[i].new = resultNewCatMuch;
        resultCat[i].new = resultManyToCatMuch;
    }
    const resultNews = await newModel.NewNews();
    const resultNew1 = resultNews.slice(0, 3);
    const resultNew2 = resultNews.slice(3, 6);
    const resultNew3 = resultNews.slice(6, 9);
    const resultNew4 = resultNews.slice(9, 12);
    console.log(resultNew1);
    console.log(resultNew2);
    console.log(resultNew3);
    console.log(resultNew4);
    return res.render('home/home', {
        resultCat: resultCat,
        resultNew1: resultNew1,
        resultNew2: resultNew2,
        resultNew3: resultNew3,
        resultNew4: resultNew4,
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