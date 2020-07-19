const db = require('../utils/db');

const TBL_TAG = 'tag';

module.exports = {
    all: function() {
        return db.load(`select * from ${TBL_TAG}`);
    },

    add: function(entity) {
        return db.insert(TBL_TAG, entity);
    },

    del: function(idTag) {
        const condition = {
            id: idTag,
        };
        return db.delete(TBL_TAG, condition);
    },

    update: function(entity) {
        const condition = {
            id: entity.id,
        };
        return db.update(TBL_TAG, entity, condition);
    },

    view: function(id) {
        return db.load(`select * from ${TBL_TAG} where id=${id}`);
    },
};