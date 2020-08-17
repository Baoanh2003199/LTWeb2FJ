const express = require('express');
const subscriberModel = require('../../models/subscriber.model');
const requestModel = require('../../models/premium.model');
const DATE_FORMATER = require('dateformat');
const userModel = require('../../models/user.model');
const roleModel = require('../../models/role.model');
const route = express.Router();

//list all
route.get('/', async function(req, res) {
    const list = await subscriberModel.allSubscriber();
    for(var subscriber of list)
    {
        subscriber.dob = DATE_FORMATER(subscriber.dob, 'dd/mm/yyyy'), // định dạng lại ngày
        subscriber.expired = DATE_FORMATER(subscriber.expired, 'HH:MM:ss - dd/mm/yyyy') // định dạng lại ngày giờ
    }; 
    res.render('admin/subscriber/home', { sub: list });
});

route.get('/check',async function(req, res) {
    const list = await requestModel.all();
    for(var request of list)
    {
        request.username = 'abc',
        request.requestDate = DATE_FORMATER(request.requestDate, 'HH:MM:ss - dd/mm/yyyy')
    }
    return res.render('admin/subscriber/check',{req: list, empty: list.length === 0});
});

route.post('/check/:id',async function(req, res) { // xử lí yêu cầu gia hạn premium
    const id = req.params.id;
    const QueryObj = await subscriberModel.byUserId(id);
    const UserObj = await userModel.view(id);
    const RoleObj = await roleModel.byCode('SUBSCRIBER');
    var extended = new Date(Date.now() + 7 * 86400000);
    const SendObj = { //update lại ngày hết hạn
        id: QueryObj[0].id, 
        name: QueryObj[0].name, 
        email: QueryObj[0].email, 
        phone: QueryObj[0].phone, 
        dob: QueryObj[0].dob, 
        userID: QueryObj[0].userID, 
        catID: QueryObj[0].catID, 
        nickname: QueryObj[0].nickname, 
        avatar: QueryObj[0].avatar, 
        expired: extended,
    };
    const UserSend = { // update lại role của user
        id: UserObj[0].id, 
        username: UserObj[0].username, 
        password: UserObj[0].password, 
        roleId: RoleObj[0].id, 
        status: UserObj[0].status,
    }
    await subscriberModel.update(SendObj);
    await userModel.update(UserSend);
    await requestModel.delByUserId(id); // delete yêu cầu premium sau khi xử lí xong
    res.redirect('/admin/subscriber/check');
});

route.post('/delete/:id', async function(req, res) {
    const id = req.params.id;
    await subscriberModel.del(id);
    res.redirect('/admin/subscriber');
});

module.exports = route;