const db = require('../utils/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const TBL_LOGIN = 'user';

module.exports = {
    all: function() {
        return db.load(`select * from ${TBL_LOGIN}`);
    },

    add: function(entity) {
        return db.insert(TBL_LOGIN, entity);
    },

    regAdd: function(entity) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(entity.password, salt);
        entity.password = hash;
        return db.insert(TBL_LOGIN, entity);
    },

    del: function(id) {
        const condition = {
            id: id,
        };
        return db.delete(TBL_LOGIN, condition);
    },

    update: function(entity) {
        const condition = {
            id: entity.id,
        };

        delete entity.id;
        return db.update(TBL_LOGIN, entity, condition);
    },

    view: function(id) {
        return db.load(`select * from ${TBL_LOGIN} where id=${id}`);
    },

    byName: function(username)
    {
        return db.load(`select * from ${TBL_LOGIN} where username='${username}'`);
    }
};