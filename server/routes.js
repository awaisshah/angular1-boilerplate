exports = module.exports = function(app) {
    // Main root API
    app.get('/',function (req,res){
        res.render("index.html");
    });
};