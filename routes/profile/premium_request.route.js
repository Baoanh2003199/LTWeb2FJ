const express = require('express');
const RequestModel = require('../../models/premium.model')
const route = express.Router();
route.get('/',async function(req, res)
{
    const queryObj = await RequestModel.byUserId(res.locals.userId); // nếu đã có record trong table premium_request thì thông báo đang xử lí yêu cầu, k gửi lại
    if(queryObj[0])
    {
        var checkExists = true;
    }
    else
    {
        var checkExists = false;
    }
    res.render('profile/premium_request',{exists: checkExists});
});


route.post('/',async function(req, res)
{
    const queryObj = await RequestModel.byUserId(res.locals.userId);
    if(queryObj[0])
    {
        res.render('profile/premium_request',{exists:true});
    }
    else
    {
        const insertObj = {
            userId: res.locals.userId,
            requestDate: new Date(Date.now() + 0)
        }
        const requestInsert = await RequestModel.add(insertObj);
        if(requestInsert)
        {
            res.render('profile/premium_request',{success:true});
        }
    }
    
})
module.exports = route;