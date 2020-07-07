const db = require('../utils/db');
const TBL_Token = 'register_token';

module.exports = {
    all: function() {
        return db.load(`select * from ${TBL_Token}`);
    },

    add: function(entity) {
        return db.insert(TBL_Token, entity);
    },

    del: function(id) {
        const condition = {
            id: id,
        };
        return db.delete(TBL_Token, condition);
    },

    update: function(entity) {
        const condition = {
            id: entity.id,
        };

        delete entity.id;
        return db.update(TBL_Token, entity, condition);
    },

    view: function(id) {
        return db.load(`select * from ${TBL_Token} where id=${id}`);
    },

    byUserId: function(userId){
        return db.load(`select * from ${TBL_Token} where userId=${userId}`);
    },

    byToken: function(token){
        return db.load(`select * from ${TBL_Token} where token='${token}'`);
    }
};