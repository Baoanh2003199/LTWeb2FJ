const db = require('../utils/db');
const TBL_NEWS = 'news';
const TBL_USER = 'user';

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
        return db.load(`select * from ${TBL_NEWS} order by id desc limit 6`);
    },
};