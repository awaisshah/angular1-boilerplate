module.exports = function (app, bearer, bcryptnodejs) {
    app.utils = {};
    app.utils.email = {};
    require('./bearer')(app, bearer, bcryptnodejs);
    require('./email')(app);
    require('./utils')(app);
};