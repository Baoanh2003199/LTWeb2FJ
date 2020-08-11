const db = require('../utils/db');
const { load } = require('../utils/db');

const TBL_EDITOR = 'editor_category';

module.exports = {
    findAllByEditor: function( userId){
        return db.load(`
            select *
            from ${TBL_EDITOR}
            where userId = '${userId}'
        `);
    },
    findCatByEditor: function(userId){
        return db.load(`
            select category
            from ${TBL_EDITOR}
            where userId = '${userId}'
        `);
    },
    view: function(category, userId){
        return db.load(`
        select *
        from ${TBL_EDITOR}
        where userId = '${userId}'
        and category = '${category}'`);
    },
    add: function(catId, userId){
        const entity = {
            userId: userId,
            category: catId,
        };
        return db.insert(TBL_EDITOR, entity);
    },
    delete: async function(catId, userId){
    
        const editor_category = await this.view(catId, userId);
        const condition = {
            id: editor_category[0].id,
        };
        return db.delete(TBL_EDITOR, condition);
    },
};


