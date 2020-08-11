const express = require('express');
const route = express.Router();
const newModel = require('../../models/news.model');
const tagModel = require('../../models/tag.model');
const catModel = require('../../models/category.model');
const news_tagModel = require('../../models/news_tag.model');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
var encoding = require('encoding');
const PDFDocument = require('pdfkit');
const newsModel = require('../../models/news.model');
const { session } = require('passport');
const doc = new PDFDocument();

route.get('/', async function(req, res){
    if(res.locals.isWriter){
        const listNews = await newsModel.findByCreatedBy(req.session.userId);

        return res.render('profile/post_management',{
            news: listNews,
            empty: listNews.length === 0,
        });
    }
    else{
        const listNews = await newsModel.findNewsByEditor(req.session.userId);

        return res.render('profile/post_management',{
            news: listNews,
            empty: listNews.length === 0,
        });
    }
   
  
});

route.get('/add', async function(req, res){
    const tagRow = await tagModel.all();
    const catRow = await catModel.getList();
    res.render('profile/news/add',{
        tag: tagRow,
        cat: catRow,
    });
})

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    },
    fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback( /*res.end('Only images are allowed')*/ null, false);
        }

        callback(null, true);
    },
});
const upload = multer({ storage: storage });
route.post('/add', upload.single('thumbnail'), async function(req, res) {
    //res.send(req.body);
    if (req.file) {
        const entity = {
            name: req.body.name,
            catID: req.body.catID,
            isPremium: req.body.isPremium,
            thumbnail: req.file.filename,
            content: req.body.content,
            description: req.body.description,
            createdBy: req.session.userId
        };
        const result = await newModel.add(entity);
        const tags = req.body.tagID;
        const nuevo = tags.map((i) => Number(i, 10));

        for (i = 0; i < nuevo.length; i++) {
            const entitys = {
                newID: result.insertId,
                tagID: nuevo[i],
            };
            await news_tagModel.insert(entitys);
        }
        var path = './public/pdf/' + entity.name + '.pdf';
        var contentHTML = entity.content;
        var regexContent = contentHTML.replace(/<\/?[^>]+(>|$)/g, '');
        var resultBuffer = encoding.convert(regexContent, 'ASCII', 'UTF-8');
        doc.text(resultBuffer, 20, 20);
        doc.fontSize(15);
        doc.pipe(fs.createWriteStream(path, 'utf8')).on('finish', function() {
        });
        doc.end();
        const entityss = {
            id: result.insertId,
            filePdf: path,
        };
        await newModel.update(entityss);
        return res.redirect(`/profile/postmanagement/view/${result.insertId}`);
    }
    return res.send('error');
});
route.get('/view/:id', async function(req, res){
    const id = req.params.id || -1;
    news = await newModel.view(id)
    if(res.locals.isWriter ){
        if(req.session.userId != news[0].createdBy){
            return res.redirect('/profile');
        }
    }else{
        const checkIsPermission = await newModel.checkNewsOfEditor(req.session.userId, news[0].id);
        if(checkIsPermission.length === 0){
            return res.redirect('/profile'); 
        }
    }
    res.render('profile/news/views',{
        news: news[0]
    })
});
route.get('/edit/:id', async function(req, res){
   
    const id = req.params.id || -1;
    news = await newModel.view(id)
    if(res.locals.isWriter ){
        if(req.session.userId != news[0].createdBy){
            return res.redirect('/profile');
        }
    }else{
        const checkIsPermission = await newModel.checkNewsOfEditor(req.session.userId, news[0].id);
        if(checkIsPermission.length === 0){
            return res.redirect('/profile'); 
        }
    }
   
    const tagRow = await tagModel.all();
    const catRow = await catModel.all();
    const listTag = await news_tagModel.loadIDNews(news[0].id);
    if(news.length == 0){
        return res.redirect('/profile/postmanagement');
    }
    return res.render('profile/news/edit',{
        news: news[0],
        tag: tagRow,
        cat: catRow,
        listTag: listTag
    })
});
route.post('/check/:id', async function(req, res){
    entity = {
        id: req.params.id,
        status: 1,
        openTime: req.body.openTime,
        note: ''
    };
    await newsModel.update(entity);
    return res.redirect('/profile/postmanagement');
});
route.post('/reject/:id', async function(req, res){
    entity = {
        id: req.params.id,
        note: req.body.note
    };
    await newsModel.update(entity);
    return res.redirect('/profile/postmanagement');
});
module.exports = route;