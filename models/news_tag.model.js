const db = require('../utils/db');
const TBL_NEWS_TAG = 'news_tag';

module.exports = {
    insert: function(entity) {
        return db.insert(TBL_NEWS_TAG, entity);
    },
};