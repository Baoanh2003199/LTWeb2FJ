const db = require('../utils/db');
const TBL_NEWS = 'news';
const TBL_USER = 'user';
const TBL_CATEGORY = 'category';

module.exports = {
    CountNews: function() {
        return db.load(`select count(id) as CountNews from ${TBL_NEWS}`);
    },
    CountUsers: function() {
        return db.load(`select count(id) as CountUser from ${TBL_USER}`);
    },
    CountViews: function() {
        return db.load(`select views from ${TBL_NEWS}`);
    },

    NewNews: function() {
        return db.load(
            `select * from ${TBL_NEWS} where status=1 order by id desc limit 12`
        );
    },

    CatToNews: function(catID) {
        return db.load(
            `select * from ${TBL_NEWS} where catID=${catID} and status=1 order by id desc limit 10`
        );
    },

    NewsDetail: function(nameNew, idNews) {
        return db.load(
            `select n.*, c.name catName
            from ${TBL_NEWS} n, category c
            where n.id=${idNews}
            and n.name like '${nameNew}'
            and n.catId = c.id`
        );
    },

    ManyNews: function(catID) {
        return db.load(
            `select * from ${TBL_NEWS} where catID=${catID} and status=1 order by views limit 10`
        );
    },

    updateViews: function(entity) {
        const condition = {
            id: entity.id,
        };
        return db.update(TBL_NEWS, entity, condition);
    },
    getTagByNewsId: function(newsId) {
        return db.load(
            `select t.*
            from  news_tag nt, tag t
            where nt.newID = ${newsId}
            and nt.tagID = t.id`
        );
    },

    search: function(text) {
        return db.load(
            `select id,name,description,thumbnail from ${TBL_NEWS} WHERE MATCH (name,description) AGAINST ('${text}' IN NATURAL LANGUAGE MODE)`
        );
    },
    downloads: function(id) {
        return db.load(`select filePdf from ${TBL_NEWS} where id=${id}`);
    },

    catParentID: function(name, parentID) {
        return db.load(
            `select * from ${TBL_CATEGORY} where name='${name}' and id=${parentID}`
        );
    },

    catNews: function(catID) {
        return db.load(`select * from ${TBL_NEWS} where catID=${catID}`);
    },
};