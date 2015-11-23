var socket = io();
var name;
var something = true;
$(document).ready(function (){
	$('#messageform').submit(function(){
		var message_string = $('#m').val();
		if (!message_string){
			return false;
		} else {
				socket.emit('send_msg', message_string);
    			$('#m').val('');
    			return false;
		};    
  	});
});

function getTime(){
	var d = new Date();
	var time = d.getHours() + ":" + d.getMinutes();
	return time;
};

function getLinks(){
	$('div').linkify();
	$('#sidebar').linkify({
    target: "_blank"
	});
};

function hideOverlay (){
	$('.overlay').fadeOut('slow');
	$('#messageform').show();
	$('#main').css('margin-top', '1%');
};

socket.on('message', function (data){
	if ( data.username === name ){
			$('#messages').append($('<div class="my-msg"></div>').text(data.message));
	} else {
		$('#messages').append($('<div class="msg"></div>').text(getTime() + ' ' + data.username +  ': ' + data.message));
	};
	getLinks();
});

socket.on('user joined', function (username){
	$('#messages').append($('<div class="user-status"></div>').text(getTime() + ' ' + username + ' joined chat'));
});

socket.on('userlist', function (data){
		$('#userlist ul').empty();
		for (key1 in data) {
			$.each( data[key1], function( key, value ) {
  			$('#userlist ul').append($('<li>' + value.toString() + '</li>'));
		});
	};
});


socket.on('user left', function (username, data){
	$('#messages').append($('<div class="user-status"></div>').text(getTime() + ' ' + username + ' left chat')); 
});

socket.on('overlap', function (username){
});

/*
var indicate = false;
 // useless piece of shit
$(function(){
	$('#m').on('keyup', function (e){
		var str = $('#m').val();
		socket.emit('thoughtsteal', str);
	});
});

socket.on('tracking', function (data){
	var timer;
	if (!indicate){
		indicate = true;
		console.log('timer started', indicate);
		timer = setTimeout(function(){
			$('.lol').text('');
			$('.lol').fadeOut('slow');
			indicate = false;
		}, 15000);
	};
	$('.lol').show();
	$('.lol').text(data.name + ": " + data.string);
});

*/ 


$(function(){
	$('#loginform').submit(function(){
		name = $('#logininput').val();
		if (!name){
			return false;
		} else {
			socket.emit('add user', name);
			$('.overlay').fadeOut('slow');
			$('#messageform').show();
			$('#main').css('margin-top', '1%');
			return false;
		};
	});
});
