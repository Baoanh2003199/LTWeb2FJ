const express = require('express');
const newModel = require('../models/home.model');
const catModel = require('../models/category.model');
const commentModel = require('../models/comment.model');
const range = require('../utils/range');
const slug = require('slug');
const newsModel = require('../models/news.model');

const router = express.Router();

//code lay bai viet cua trang main
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
        for (j = 0; j < listParentID.length; j++) {
            listParentID[j].slug = slug(listParentID[j].name);
        }
        listMain[i].parentCat = listParentID;
    }

    const hotNews = await newModel.hotNews();
    return res.render('home/home', {
        resultCat: resultCat,
        resultNew1: resultNew1,
        resultNew2: resultNew2,
        resultNew3: resultNew3,
        resultNew4: resultNew4,
        listMain: listMain,
        hotNews: hotNews,
    });
});

//code lay bai viet chi tiet
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
        for (j = 0; j < listParentID.length; j++) {
            listParentID[j].slug = slug(listParentID[j].name);
        }
        listMain[i].parentCat = listParentID;
    }
    if (news.length != 0) {
        if (news.isPremium == 1) {
            if (!res.locals.isLoggedIn || req.session.role == 'CASUAL') {
                return res.render('home/news', {
                    news: news,
                    listMain: listMain,
                    isExpired: false,
                });
            }
        }
        news.tag = await newModel.getTagByNewsId(news.id);
        news.tag.forEach((tag) => {});
        const entity = {
            id: id,
            views: addViews,
        };
        await newModel.updateViews(entity);
        return res.render('home/news', {
            news: news,
            listMain: listMain,
            listComment: listComment,
            isExpired: true,
        });
    }
});

//phan code search fulltext
router.get('/search', async function(req, res) {
    const name = req.query.name;
    const searchList = await newModel.search(name);
    const listMain = await catModel.catSingle();
    for (i = 0; i < listMain.length; i++) {
        const catID = listMain[i].id;
        const listParentID = await catModel.catParentID(catID);
        for (j = 0; j < listParentID.length; j++) {
            listParentID[j].slug = slug(listParentID[j].name);
        }
        listMain[i].parentCat = listParentID;
    }
    res.render('home/search', {
        searchList: searchList,
        empty: searchList.length === 0,
        listMain: listMain,
    });
});

//phan code dowloads bai viet chi tiet
router.get('/download/:id', async function(req, res, next) {
    const id = req.params.id;
    const result = await newModel.downloads(id);
    const path = './public/pdf/';
    const fileName = result[0].filePdf;
    res.download(path, fileName);
});

//phan code lay bai viet theo category
router.get('/category', async function(req, res) {
    const name = req.query.name || 'none';
    const parentID = req.query.id || -1;
    const page = req.query.page || 1;
    const list = await newModel.catParentID(parentID);
    const total = await newModel.totalNewsByCatId(parentID);

    const limit = 2;
    const totalPage = Math.ceil(Number(total / limit));
    const offset = limit * (page - 1);

    for (i = 0; i < list.length; i++) {
        const catID = list[i].id;
        const catNew = await newModel.catNews(catID, offset, limit);
        list[i].new = catNew;
        list[i].slug = slug(list[i].name);
    }
    const listMain = await catModel.catSingle();
    for (i = 0; i < listMain.length; i++) {
        const catID = listMain[i].id;
        const listParentID = await catModel.catParentID(catID);
        for (j = 0; j < listParentID.length; j++) {
            listParentID[j].slug = slug(listParentID[j].name);
        }
        listMain[i].parentCat = listParentID;
        listMain[i].slug = slug(listMain[i].name);
    }
    return res.render('home/category', {
        listMain: listMain,
        list: list,
        page: page,
        totalPage: totalPage,
    });
});

//phan code lay bai viet theo tag
router.get('/tag/', async function(req, res) {
    const tagId = req.query.id;
    const page = req.query.page || 1;
    const limit = 1;

    const tagName = await newModel.tagName(tagId);
    const total = await newModel.totalNewsByTagId(tagId);
    const offset = limit * (page - 1);
    const totalPage = Math.ceil(total / limit);

    for (i = 0; i < tagName.length; i++) {
        const ID = tagName[i].id;
        const result = await newModel.tagNew(ID, offset, limit);
        tagName[i].tag = result;
    }
    const listMain = await catModel.catSingle();
    for (i = 0; i < listMain.length; i++) {
        const catID = listMain[i].id;
        const listParentID = await catModel.catParentID(catID);
        for (j = 0; j < listParentID.length; j++) {
            listParentID[j].slug = slug(listParentID[j].name);
        }
        listMain[i].parentCat = listParentID;
        listMain[i].slug = slug(listMain[i].name);
    }

    res.render('home/tagNew', {
        tagName: tagName,
        listMain: listMain,
        page: page,
        totalPage,
        totalPage,
    });
});

router.post('/comment', async function(req, res) {
    const userID = res.locals.userId;
});
module.exports = router;