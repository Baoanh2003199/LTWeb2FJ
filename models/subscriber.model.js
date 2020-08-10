const db = require('../utils/db');

const TBL_SUBSCRIBER = 'subscriber';

module.exports = {
    all: function() {
        return db.load(`select * from ${TBL_SUBSCRIBER}`);
    },

    allMember: function()
    {
        return db.load(`select * from ${TBL_SUBSCRIBER} s join user u on s.UserID = u.id where u.roleID <> (select id from role where code = 'SUBSCRIBER') `);
    },
    allSubscriber: function(){
        return db.load(`select * from ${TBL_SUBSCRIBER} s join user u on s.UserID = u.id where u.roleID = (select id from role where code = 'SUBSCRIBER') `);
    },

    view: function(id) {
        return db.load(`select * from ${TBL_SUBSCRIBER} where id=${id}`);
    },

    byUserId: function(id) {
        return db.load(`select * from ${TBL_SUBSCRIBER} where userID=${id}`);
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

        return db.update(TBL_SUBSCRIBER, entity, condition);
    },

    byEmail: function(email) {
        return db.load(`select * from ${TBL_SUBSCRIBER} where email='${email}'`);
    },

    byNickname: function(nickname) {
        return db.load(`select * from ${TBL_SUBSCRIBER} where nickname='${nickname}'`);
    },
    findAllEditor: function(){
        return db.load(`select s.*, r.name as role
        from ${TBL_SUBSCRIBER} s, user u, role r
        where s.userID = u.id
        and u.roleId = '11'
        and r.id = u.roleId`);
    }
};