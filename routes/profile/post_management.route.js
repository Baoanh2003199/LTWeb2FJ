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
const doc = new PDFDocument();

route.get('/', async function(req, res){
    if(res.locals.isWriter){
        const listNews = await newsModel.findByCreatedBy(req.session.userId);
        console.log(listNews);
    }
   
    res.render('profile/post_management')
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
            openTime: req.body.openTime,
            description: req.body.description,
            createdBy: req.session.userId
        };
        console.log(req.session.userId);
        const result = await newModel.add(entity);
        const tags = req.body.tagID;
        const nuevo = tags.map((i) => Number(i, 10));

        for (i = 0; i < nuevo.length; i++) {
            const entitys = {
                newID: result.insertId,
                tagID: nuevo[i],
            };
            console.log(entitys);
            await news_tagModel.insert(entitys);
        }
        var path = './public/pdf/' + entity.name + '.pdf';
        var contentHTML = entity.content;
        var regexContent = contentHTML.replace(/<\/?[^>]+(>|$)/g, '');
        var resultBuffer = encoding.convert(regexContent, 'ASCII', 'UTF-8');
        doc.text(resultBuffer, 20, 20);
        doc.fontSize(15);
        doc.pipe(fs.createWriteStream(path, 'utf8')).on('finish', function() {
            console.log('PDF closed');
        });
        doc.end();
        const entityss = {
            id: result.insertId,
            filePdf: path,
        };
        await newModel.update(entityss);
        return res.redirect(`/profile/postmanagement/views/${result.insertId}`);
    }
    return res.send('error');
});
route.get('/views/:id', async function(req, res){
    const id = req.params.id || -1;
    console.log(id);
    news = await newModel.view(id)
    
    res.render('profile/news/views',{
        news: news
    })
});
module.exports = route;