var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var express = require('express');
var logger = require('morgan');
var path = require('path');
var Q = require('q');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, '../client'));
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.set('views', path.join(__dirname, '../client'));
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.resolve(__dirname, '../client')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());


require('./routes')(app);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message,
        error: err
    });
});


module.exports = app;
