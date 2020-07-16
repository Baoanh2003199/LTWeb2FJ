const express = require('express');
const newModel = require('../models/home.model');
const catModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function(req, res) {
    const resultCat = await catModel.allSubCategory();
    const idCat = resultCat[0].id;
    const listVewCat = await newModel.CatNews(idCat);
    const listNew = await newModel.NewNews();
    const manyNew = await newModel.ManyNews(idCat);
    res.render('home/home', {
        listNew: listNew,
        listVewCat: listVewCat,
        resultCat: resultCat,
        manyNew: manyNew,
    });
});

router.get('/:name/:id', async function(req, res) {
    const name = req.params.name;
    const id = req.params.id;
    const list = await newModel.NewsDetail(name, id);
    res.render('home/news', { list: list });
});

router.get('/search', function(req, res) {
    res.render('home/search');
});
module.exports = router;