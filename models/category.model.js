const db = require('../utils/db');

const TBL_CATEGORY = 'category';

module.exports = {
    all: function() {
        return db.load(`select cat1.*, cat2.name  parentName
        from ${TBL_CATEGORY} cat1
        left join ${TBL_CATEGORY} cat2
        on cat1.parentID = cat2.id`);
    },

    catParentID: function(parentID) {
        return db.load(`select * from ${TBL_CATEGORY} where parentID=${parentID}`);
    },

    catSingle: function() {
        return db.load(`select * from ${TBL_CATEGORY} where parentID='0'`);
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
        return db.load(`select cat1.*, cat2.name parentName
        from ${TBL_CATEGORY} cat1 
        left join category cat2
        on cat1.parentID = cat2.id 
        where cat1.id=${id}`);
    },

    getList: function() {
        return db.load(`select * from ${TBL_CATEGORY} where parentID != 0`);
    },

    allSubCategory: function() {
        return db.load(`select * from ${TBL_CATEGORY} where parentID='0'`);
    },

    singeNew: function(idNews) {
        return db.load(`select name from ${TBL_CATEGORY} where id=${idNews}`);
    },

    nameCategory: function() {
        return db.load(`select * from ${TBL_CATEGORY} where parentID='0'`);
    },
};