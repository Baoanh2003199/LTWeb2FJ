const db = require('../utils/db');

const TBL_ROLE = 'role';

module.exports = {
    all: function() {
        return db.load(`select * from ${TBL_ROLE}`);
    },
    single: function(id) {
        return db.load(`select * from ${TBL_ROLE} where id = ${id}`);
    },
};