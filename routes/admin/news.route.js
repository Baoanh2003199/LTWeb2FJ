const express = require('express');
const newModel = require('../../models/news.model');
const tagModel = require('../../models/tag.model');
const catModel = require('../../models/category.model');
const news_tagModel = require('../../models/news_tag.model');
const list = require('../../utils/array');
const route = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var encoding = require('encoding');
const PDFDocument = require('pdfkit');
const doc = new PDFDocument();

// Danh sách bài viết
route.get('/', async function(req, res) {
    const list = await newModel.all();
    res.render('admin/news/home', { news: list, empty: list.length === 0 });
});
// Thêm bài viết
route.get('/add', async function(req, res) {
    const tagRow = await tagModel.all();
    const catRow = await catModel.getList();
    res.render('admin/news/add', {
        tag: tagRow,
        cat: catRow,
    });
});
//mo cai notepad

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
        };
        console.log(entity);
        const result = await newModel.add(entity);
        console.log(result);
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
    }
    res.redirect('/admin/news');
});

// Lấy id tìm model rồi gán vào views
route.get('/edit/:id', async function(req, res) {
    const id = req.params.id;
    const rows = await newModel.view(id);
    const tagRow = await tagModel.all();
    const catRow = await catModel.all();
    const news = rows[0];
    console.log(news);
    if (rows.length === 0) return res.send('Invalid parameter.');
    res.render('admin/news/edit', { news, tag: tagRow, cat: catRow });
});

route.post('/edit', upload.single('thumbnail'), async function(req, res) {
    if (req.file) {
        const entity = {
            name: req.body.name,
            catID: req.body.catID,
            isPremium: req.body.isPremium,
            thumbnail: req.file.filename,
            content: req.body.content,
            openTime: req.body.openTime,
            description: req.body.description,
        };
        const result = await newModel.update(entity);
        await news_tagModel.del(result.insertId);
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
    }

    res.redirect('/admin/news');
});
// Duyệt bài
route.get('/check', async function(req, res) {
    const list = await newModel.check();
    res.render('admin/news/check', { news: list, empty: list.length === 0 });
});
route.post('/check/:id', async function(req, res) {
    const num = req.params.num;
    entity = {
        id: req.params.id,
        status: req.query.status,
    };
    if (num == '1') {
        await newModel.update(entity);
    } else {
        await newModel.update(entity);
    }
    res.redirect('/admin/news/check');
});
// Xem chi tiết
route.get('/view/:id', async function(req, res) {
    const id = req.params.id;
    const list = await newModel.view(id);
    res.render('admin/news/view', { news: list, empty: list.length === 0 });
});

//xoa bai biet
route.post('/delete/:id', async function(req, res) {
    const id = req.params.id;
    await newModel.del(id);
    res.redirect('/admin/news');
});
module.exports = route;