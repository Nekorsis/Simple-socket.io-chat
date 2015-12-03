var app = require ('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;
var getData = require('./gulp/utils/getData');
var initMessages = require('./views/data/messages.json');
var initThreads = require('./views/data/threads.json');

app.set('view engine', 'jade');
app.set('views', 'views/pages');
app.use(express.static('static'));


var usernames = {};

http.listen(port, function (){
	console.log('Server is up and running')
});


app.get('/', function (req, res){
	// TODO: send initial data here
	res.render('index', {
		messages: initMessages,
		threads: initThreads
	});
});

io.on('connection', function (socket){
	var addedUser = false;
	socket.on('send_msg', function (msg){
		io.sockets.emit('message', {message: msg,
			username: socket.username});
	});

	socket.on('add user', function (username){
		addedUser = true;
		socket.username = username;
		usernames[username] = username;
		io.sockets.emit('user joined', socket.username);
	});

	socket.on('disconnect', function(){
		io.sockets.emit('user left', socket.username);
		if (addedUser){
			delete usernames[socket.username];
		};
	});
});

