var app = require ('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.set('view engine', 'jade');
app.use(express.static('static'));


var usernames = {};
http.listen(port, function (){
	console.log('Server is up and running')
});


app.get('/', function (req, res){
	res.render('main', {names: usernames});
});

function validate (name, object){
	var some = [];
	some = Object.keys(object);
	for ( i = 0; i < some.length; i++){
		if (some[i] === name) {
			console.log('validate false');
			console.log(some[i]);
			return false;
		};
	};
	return true;
};





io.on('connection', function (socket){
	var addedUser = false;
	socket.on('send_msg', function (msg){
		io.sockets.emit('message', {message: msg,
			username: socket.username});
	});

	socket.on('add user', function (username){
		var temp = username;
		if (!validate(username, usernames)){
			io.sockets.emit('overlap', temp);
			io.sockets.emit('userlist', {data: usernames});
			return;
		};
		addedUser = true;
		socket.username = temp;
		usernames[temp] = temp;
		io.sockets.emit('user joined', socket.username);
		io.sockets.emit('userlist', {data: usernames});
		console.log(usernames);
	});
	
	socket.on('disconnect', function(){
		io.sockets.emit('user left', socket.username);
		if (addedUser){
			delete usernames[socket.username];
		};
		io.sockets.emit('userlist', {data: usernames});
		//console.log(usernames);
	});

		socket.on('thoughtsteal', function (str){
		io.sockets.emit('tracking', {string: str, name: socket.username});
		console.log(str, socket.username);
	});	
});

