var app = require ('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
app.set('view engine', 'jade');
app.use(express.static('static'));

http.listen(port, function (){
});

app.get('/', function (req, res){
	res.render('main');
});

io.on('connection', function (socket){
	socket.on('send_msg', function (msg){
		io.sockets.emit('message', {message: msg,
			username: socket.username});
	});

	socket.on('add user', function (username){
			socket.username = username;
			io.sockets.emit('user joined', socket.username);
	});

	socket.on('disconnect', function(){
		io.sockets.emit('user left', socket.username);
	});
});

