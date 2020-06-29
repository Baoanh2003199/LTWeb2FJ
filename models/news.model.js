const db = require('../utils/db');
const upload = require('../utils/uploadFile');

const TBL_NEWS = 'news';

module.exports = {
    all: function() {
        return db.load(`select id,name,description,catID,status from ${TBL_NEWS}`);
    },
    del: function(idNews) {
        const condition = {
            id: idNews,
        };
        return db.delete(TBL_NEWS, condition);
    },
    view: function(id) {
        return db.load(
            `select name,description,content,catID,isPremium,openTime,note,createdBy from ${TBL_NEWS} where id=${id}`
        );
    },
    check: function(id) {
        return db.load(
            `select id,name,description,catID,isPremium from ${TBL_NEWS} where id=${id}`
        );
    },
    add: function(entity) {
        return db.insert(TBL_NEWS, entity);
    },
};