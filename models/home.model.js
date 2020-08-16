const db = require('../utils/db');
const TBL_NEWS = 'news';
const TBL_USER = 'user';
const TBL_CATEGORY = 'category';
const TBL_NEW_TAG = 'news_tag';
const TBL_TAG = 'tag';
const TBL_COMMENT = 'comment';

module.exports = {
    CountNews: function() {
        return db.load(`select count(id) as CountNews from ${TBL_NEWS}`);
    },
    CountUsers: function() {
        return db.load(`select sum(id) as CountUser from ${TBL_USER}`);
    },
    CountViews: function() {
        return db.load(`select sum(views) as views from ${TBL_NEWS}`);
    },

    NewNews: function() {
        return db.load(
            `select * from ${TBL_NEWS} 
            where status=1
            and opentime < now()
             order by id desc
              limit 12`
        );
    },

    CatToNews: function(catID) {
        return db.load(
            `select * from ${TBL_NEWS} 
            where catID=${catID} 
            and opentime < now()
            and status=1 order by id desc
             limit 10`
        );
    },

    NewsDetail: function(nameNew, idNews) {
        return db.load(
            `select n.*, c.name catName
            from ${TBL_NEWS} n, category c
            where n.id=${idNews}
            and opentime < now()
            and n.name like '${nameNew}'
            and n.catId = c.id`
        );
    },

    ManyNews: function(catID) {
        return db.load(
            `select * 
            from ${TBL_NEWS} 
            where catID=${catID}
            and opentime < now()
             and status=1 order by views 
             limit 10`
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

    catParentID: function(parentID) {
        return db.load(
            `select * from ${TBL_CATEGORY} where id=${parentID}`
        );
    },

    catNews: function(catID, offset, limit) {
        return db.load(`select *
         from ${TBL_NEWS} 
         where catID=${catID}
         and opentime < now()
         limit ${limit}
         offset ${offset}`);
    },

    tagNew: function(idTag, offset, limit) {
        return db.load(
            `select n.id,n.name,n.thumbnail,n.description, n.isPremium
             from ${TBL_NEW_TAG} t 
             join ${TBL_NEWS} n 
             where t.tagID = ${idTag}
              and t.newID=n.id
              and opentime < now()
            limit ${limit}
            offset ${offset}`
        );
    },

    tagName: function(tagId) {
        return db.load(`select * from ${TBL_TAG} where id=${tagId}`);
    },

    insertComment: function(entity) {
        const condition = {
            id: entity.id,
        };
        return db.update(TBL_COMMENT, entity, condition);
    },

    commentUser: function(id) {
        return db.load(`select * from ${TBL_USER} where id=${id}`);
    },

    commentNew: function(userID, newsID) {
        return db.load(
            `select * from ${TBL_COMMENT} where userID=${userID} and newsID=${newsID}`
        );
    },
    newsByCatId: function(catId){
        return db.load(
            `select * 
            from news 
            where catID=${catId}
            and opentime < now()`
        );
    },
    catById: function(catId){
        return db.load(
            `select * 
            from category
            where id=${catId}`
        );
    },
    totalNewsByCatId: async  function(catId){

        const resultTotalPage = await db.load(
            `select count(*) as total
            from news 
            where catID=${catId}
            and opentime < now()`
        );
        return parseInt(resultTotalPage[0].total);
    },
    totalNewsByTagId: async function(tagId){
        const result = await  db.load(
            `select count(*) as total
             from ${TBL_NEW_TAG} t 
             join ${TBL_NEWS} n 
             where t.tagID = ${tagId} 
             and t.newID=n.id
             and opentime < now()`
        );
        return result[0].total;
    }
};