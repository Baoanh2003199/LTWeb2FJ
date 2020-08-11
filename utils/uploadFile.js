const multer = require('multer');
const md5 = require('md5');

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        const path = req.query.path;
        return callback(null, `../public/uploads//${path}`);
    },
    filename: function(req, file, callback) {
        const match = ['img/png', 'image/jpeg'];
        if (match.indexOf(file.mimetype) == -1) {
            const errorMsg = 'Vui lòng chọn file hình ảnh';
            return callback(errorMsg, null);
        }
        const mimetype = file.mimetype;
        const extension = mimetype.replace('image/', '');
        const filename = md5(`${Date.now}${file.originalname}`);
        return callback(null, `${filename}.${extension}`);
    },
});
const uploadFile = multer({
    storage: diskStorage,
}).single('file');

module.exports = {
    uploadFile: uploadFile,
};