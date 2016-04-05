module.exports = function (app, bcryptnodejs, request, Q, async, path) {

    app.api = {};

    require('./user')(app, bcryptnodejs);
    require('./company')(app);
    require('./process')(app, bcryptnodejs, Q);
    require('./docusign')(app, bcryptnodejs, request, Q, async, path);

};