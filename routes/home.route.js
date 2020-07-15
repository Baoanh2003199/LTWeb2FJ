const express = require('express');
const newModel = require('../models/home.model');
const catModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function(req, res) {
    const resultCat = await catModel.allSubCategory();
    console.log(resultCat);
    console.log(resultCat.id);
    console.log(resultCat[0]);
    const idCat = resultCat[0].id;
    const listVewCat = await newModel.CatNews(idCat);
    const listNew = await newModel.NewNews();
    const idCatNews = listNew[0].id;
    const CatName = await catModel.singeNew(idCatNews);
    const manyNew = await newModel.ManyNews(idCat);
    res.render('home/home', {
        listNew: listNew,
        CatName: CatName,
        listVewCat: listVewCat,
        resultCat: resultCat,
        manyNew: manyNew,
    });
});

router.get('/news', function(req, res) {
    res.render('home/news');
});

router.get('/search', function(req, res) {
    res.render('home/search');
});
module.exports = router;