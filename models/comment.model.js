const db = require('../utils/db');
const { load } = require('../utils/db');

const TBL_EDITOR = 'comment';

module.exports = {
    add: function(userId, newsId, content){
        const entity = {
            userId: userId,
            content: content,
            newsId: newsId
        };
        return db.insert(TBL_EDITOR, entity);
    },
    findByNewId: function(newsId){
        return db.load(`select c.*, s.avatar, s.name as user_name
            from comment c, subscriber s
            where c.userID = s.userID
            and c.newsId = ${newsId}`);
    },
    findInfoByUserId: function(userId){
        return db.load(`select name, avatar
                    from subscriber 
                    where userID = ${userId}`);
    }
};


