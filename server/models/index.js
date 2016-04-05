module.exports = function (app, mongoose) {
    require('./user')(app, mongoose);
    require('./company')(app, mongoose);
    require('./template')(app, mongoose);
    require('./process')(app, mongoose);
    require('./processTemplate')(app, mongoose);
    require('./document')(app, mongoose);
    require('./recipient')(app, mongoose);
};