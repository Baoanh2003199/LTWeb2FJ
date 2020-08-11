const express = require('express');
const newModel = require('../models/home.model');
const catModel = require('../models/category.model');
const commentModel = require('../models/comment.model');
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
    for (i = 0; i < listMain.length; i++) {
        const catID = listMain[i].id;
        const listParentID = await catModel.catParentID(catID);
        listMain[i].parentCat = listParentID;
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
    const listMain = await catModel.catSingle();
    const listComment = await commentModel.findByNewId(news.id);
    for (i = 0; i < listMain.length; i++) {
        const catID = listMain[i].id;
        const listParentID = await catModel.catParentID(catID);
        listMain[i].parentCat = listParentID;

    }
    if (news.length != 0) {
        news.tag = await newModel.getTagByNewsId(news.id);
        news.tag.forEach((tag) => {
        });
        const entity = {
            id: id,
            views: addViews,
        };
        await newModel.updateViews(entity);
        return res.render('home/news', {
            news: news,
            listMain: listMain,
            listComment: listComment,
        });
    }
});

router.get('/search', async function(req, res) {
    const name = req.query.name;
    const searchList = await newModel.search(name);
    const listMain = await catModel.catSingle();
    for (i = 0; i < listMain.length; i++) {
        const catID = listMain[i].id;
        const listParentID = await catModel.catParentID(catID);
        listMain[i].parentCat = listParentID;
    }
    res.render('home/search', {
        searchList: searchList,
        empty: searchList.length === 0,
        listMain: listMain,
    });
});

router.get('/download/:id', async function(req, res, next) {
    const id = req.params.id;
    const result = await newModel.downloads(id);
    const path = './public/pdf/';
    const fileName = result[0].filePdf;
    res.download(path, fileName);
});

router.get('/category/name=:name/id=:id', async function(req, res) {
    const name = req.params.name;
    const parentID = req.params.id;
    const page = req.query.page|| 1;
    const list = await newModel.catParentID(name, parentID);
    for (i = 0; i < list.length; i++) {
        const catID = list[i].id;
        const catNew = await newModel.catNews(catID);
        list[i].new = catNew;
    }
    const listMain = await catModel.catSingle();
    for (i = 0; i < listMain.length; i++) {
        const catID = listMain[i].id;
        const listParentID = await catModel.catParentID(catID);
        listMain[i].parentCat = listParentID;
    }
    return res.render('home/category', {
        listMain: listMain,
        list: list,
        page: page
    });
});

router.get('/tag/:id', async function(req, res) {
    const tagId = req.params.id;

    const tagName = await newModel.tagName(tagId);


    for (i = 0; i < tagName.length; i++) {
        const ID = tagName[i].id;
        const result = await newModel.tagNew(ID);
        tagName[i].tag = result;
    }
    const listMain = await catModel.catSingle();
    for (i = 0; i < listMain.length; i++) {
        const catID = listMain[i].id;
        const listParentID = await catModel.catParentID(catID);
        listMain[i].parentCat = listParentID;
    }

    res.render('home/tagNew', { tagName: tagName, listMain: listMain });
});

router.post('/comment', async function(req, res) {
    const userID = res.locals.userId;
});
module.exports = router;