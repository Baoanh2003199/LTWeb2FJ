const express = require('express');

const route = express.Router();

const commentModel = require('../models/comment.model');

route.post('/add', async function(req, res){

    const result = await commentModel.add(req.session.userId, req.body.newsId, req.body.content);
    const info = await commentModel.findInfoByUserId(req.session.userId);
    res.render('_partials/comment', {
        layout: false,
        name: info[0].name,
        content: req.body.content,
        avatar: info[0].avatar,
    });

});


module.exports = route;