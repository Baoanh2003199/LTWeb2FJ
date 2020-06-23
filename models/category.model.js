const db = require('../utils/db');

const TBL_CATEGORY = 'category';

module.exports = {
    all: function() {
        return db.load(`select * from ${TBL_CATEGORY}`);
    },

    add: function(entity) {
        return db.insert(TBL_CATEGORY, entity);
    },

    del: function(idCat) {
        const condition = {
            id: idCat,
        };
        return db.delete(TBL_CATEGORY, condition);
    },
    update: function(entity) {
        const condition = {
            id: entity.id,
        };
        delete entity.id;
        return db.update(TBL_CATEGORY, entity, condition);
    },
    view: function(id) {
        return db.load(`select * from ${TBL_CATEGORY} where id=${id}`);
    },
};