const db = require('../utils/db');
const TBL_NEWS_TAG = 'news_tag';

module.exports = {
    insert: function(entity) {
        return db.insert(TBL_NEWS_TAG, entity);
    },

    del: function(id) {
        const condition = {
            newID: id,
        };
        return db.delete(TBL_NEWS_TAG, condition);
    },
};