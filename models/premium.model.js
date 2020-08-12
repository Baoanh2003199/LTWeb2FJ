const db = require('../utils/db');
const TBL_request = 'premium_request';

module.exports = {
    all: function() {
        return db.load(`select * from ${TBL_request}`);
    },

    add: function(entity) {
        return db.insert(TBL_request, entity);
    },

    del: function(id) {
        const condition = {
            id: id,
        };
        return db.delete(TBL_request, condition);
    },

    delByUserId: function(id){
        const condition = {
            userId: id,
        };
        return db.delete(TBL_request, condition);
    },

    update: function(entity) {
        const condition = {
            id: entity.id,
        };

        delete entity.id;
        return db.update(TBL_request, entity, condition);
    },

    view: function(id) {
        return db.load(`select * from ${TBL_request} where id=${id}`);
    },

    byUserId: function(id) {
        return db.load(`select * from ${TBL_request} where userId=${id}`);
    },
};