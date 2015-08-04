var express = require('express');
var app = express();
var path = require('path');
var http = require('http');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

module.exports = app;
