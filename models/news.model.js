const db = require('../utils/db');
const upload = require('../utils/uploadFile');


const TBL_NEWS = 'news';

module.exports = {
    all: function() {
        return db.load(`select n.id, n.name, n.description, n.catID, n.status, cat.name catName
        from ${TBL_NEWS} n, category cat
        where n.catID = cat.id`);
    },
    del: function(idNews) {
        const condition = {
            id: idNews,
        };
        return db.delete(TBL_NEWS, condition);
    },
    view: function(id) {
        return db.load(
            `select n.id, n.name, n.description, n.content, n.catID, n.isPremium,
             n.openTime, n.note, n.createdBy, n.thumbnail,
             cat.name catName
            from ${TBL_NEWS} n , category cat
             where n.id=${id}
             and n.catID = cat.ID`
        );
    },
    check: function() {
        return db.load(
            `select id,name,description,catID,isPremium from ${TBL_NEWS} where status='0'`
        );
    },
    add: function(entity) {
        return db.insert(TBL_NEWS, entity);
    },
    update: function(entity) {
        const condition = {
            id: entity.id,
        };
        delete entity.id;
        return db.update(TBL_NEWS, entity, condition);
    },
    single: function() {
        return db.load(`select id from ${TBL_NEWS} order by id desc limit 1`);
    },

    singleName: function(name) {
        return db.load(`select id from ${TBL_NEWS} where name=${name}`);
    },
    findByCreatedBy: function(createdBy){
        return db.load(`select n.id, n.name, n.description, n.content, n.catID, n.isPremium,
        n.openTime, n.note, n.createdBy, n.thumbnail, n.status,
        cat.name catName 
        from ${TBL_NEWS} n, category cat
        where createdBy=${createdBy}
        and n.catID = cat.ID`);
    },
    findNewsByEditor: function(userId){
        return db.load(`select n.*
        from news n, user u
        where u.id = ${userId}
        and n.status = 0
        and n.catID in ( select ed.category
                        from editor_category ed
                        where ed.userId = u.id)`);
    },
    checkNewsOfEditor: function (userId, newsId){
        return db.load(`select n.*
        from news n, user u
        where u.id = ${userId}
        and n.status = 0
        and n.id = ${newsId}
        and n.catID in ( select ed.category
                        from editor_category ed
                        where ed.userId = u.id);`)
    }
};