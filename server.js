var app = require('express')();
var express = require('express');
var http = require('http').Server(app);

app.get('/', function (req, res){
  res.render('main');
});

app.set('view engine', 'jade');
app.use(express.static('static'));

http.listen(3000, function(){
  console.log('listening on *:3000');
});