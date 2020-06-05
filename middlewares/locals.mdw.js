


module.exports = function (app) {
    app.use(function(req, res, next){
        // Set local variable
        next();
    })
}