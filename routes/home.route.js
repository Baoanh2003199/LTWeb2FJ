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
        resultCat[i].newCat = resultNewCatMuch;
        resultCat[i].newMany = resultManyToCatMuch;
    }
    const resultNews = await newModel.NewNews();
    const resultNew1 = resultNews.slice(0, 3);
    const resultNew2 = resultNews.slice(3, 6);
    const resultNew3 = resultNews.slice(6, 9);
    const resultNew4 = resultNews.slice(9, 12);
    const listMain = await catModel.catSingle();
    console.log(listMain);
    for (i = 0; i < listMain.length; i++) {
        const catID = listMain[i].id;
        const listParentID = await catModel.catParentID(catID);
        console.log(listParentID);
        listMain[i].parentCat = listParentID;
        console.log(listMain);
    }
    return res.render('home/home', {
        resultCat: resultCat,
        resultNew1: resultNew1,
        resultNew2: resultNew2,
        resultNew3: resultNew3,
        resultNew4: resultNew4,
        listMain: listMain,
    });
});

router.get('/:name/id=:id', async function(req, res) {
    const name = req.params.name;
    const id = req.params.id;
    const list = await newModel.NewsDetail(name, id);
    const addViews = list[0].views + 1;
    const news = list[0];
    if (news.length != 0) {
        news.tag = await newModel.getTagByNewsId(news.id);
        news.tag.forEach((tag) => {
            console.log(tag);
        });
        const entity = {
            id: id,
            views: addViews,
        };
        await newModel.updateViews(entity);
        return res.render('home/news', {
            news: news,
        });
    }
});

router.get('/search', async function(req, res) {
    const name = req.query.name;
    console.log(name);
    const searchList = await newModel.search(name);
    res.render('home/search', {
        searchList: searchList,
        empty: searchList.length === 0,
    });
});
module.exports = router;