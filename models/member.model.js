const db = require('../utils/db');

const TBL_MEMBER = 'member';

module.exports = {
    all: function() {
        return db.load(`select * from ${TBL_MEMBER}`);
    },

    add: function(entity) {
        return db.insert(TBL_MEMBER, entity);
    },

    del: function(idMem) {
        const condition = {
            id: idMem,
        };
        return db.delete(TBL_MEMBER, condition);
    },

    update: function(entity) {
        const condition = {
            id: entity.id,
        };

        return db.update(TBL_MEMBER, entity, condition);
    },

    view: function(id) {
        return db.load(`select * from ${TBL_MEMBER} where id=${id}`);
    },
};