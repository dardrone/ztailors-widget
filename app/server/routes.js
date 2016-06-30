var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/index.html', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

router.get('/bootstrap', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.bootstrap.html'));
});

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

module.exports = router;
