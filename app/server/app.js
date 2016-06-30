var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var fs = require('fs');
var routes = require('./routes');

// express app
var app = express();

// create log file
fs.mkdir(path.join(__dirname, '../../logs'), function() {
    fs.open(path.join(__dirname, '../../logs/express.log'), 'w', function(err) {
        if (err) {
            //console.error(err);
        }
    });
});

// webpack setup
require('./config/webpack-setup')(app);

app.use(favicon(path.join(__dirname, '../../public/favicon.png')));
app.use(express.static(path.join(__dirname, '../../public'), {maxAge: '3 years'}));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found: ' + req.path);
  err.status = 404;
  next(err);
});

module.exports = app;