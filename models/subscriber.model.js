const db = require('../utils/db');

const TBL_SUBSCRIBER = 'subscriber';

module.exports = {
    all: function() {
        return db.load(`select * from ${TBL_SUBSCRIBER}`);
    },

    view: function(id) {
        return db.load(`select * from ${TBL_SUBSCRIBER} where id=${id}`);
    },

    del: function(idSub) {
        const condition = {
            id: idSub,
        };
        return db.delete(TBL_SUBSCRIBER, condition);
    },

    add: function(entity) {
        return db.insert(TBL_SUBSCRIBER, entity);
    },

    update: function(entity) {
        const condition = {
            id: entity.id,
        };

        delete entity.id;
        return db.update(TBL_SUBSCRIBER, entity, condition);
    },

    byEmail: function(email){
        return db.load(`select * from ${TBL_SUBSCRIBER} where email='${email}'`);
    }
};