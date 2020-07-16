const express = require('express');
const newModel = require('../models/home.model');
const catModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function(req, res) {
    const resultCat = await catModel.allSubCategory();
    for (i = 0; i < resultCat.length; i++) {
        const catID = resultCat[i].id;
        const resultNewCatMuch = await newModel.CatToNews(catID);
        console.log(resultNewCatMuch);
        // bài viết mỗi chuyên mục sẽ nằm ở  news của mỗi resultCat thêm cái foreach bên trong cho news ra là đc
        resultCat[i].news  = resultNewCatMuch;
        // console.log(catID);
        // console.log(resultCat[i].news);      
        // Nãy mày để res.render ở trong for nên nó chạy hoài cái đó với nhớ phải return về
    }
    return res.render('home/home', {
        resultCat: resultCat,
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