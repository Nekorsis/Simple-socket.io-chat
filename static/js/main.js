
var socket = io();
var name;
$(function(){
	$('#messageform').hide();
});

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
	$('p').linkify();
	$('#sidebar').linkify({
    target: "_blank"
	});
};


socket.on('message', function (data){
	var scroll = 500;
	if ( data.username === name ){
			$('#messages').append($('<p class="my-msg"></p>').text(data.message));
			$('#main').scrollTop(300);
			getLinks();
	}
	else {
		$('#messages').append($('<p class="msg"></p>').text(getTime() + ' ' + data.username +  ': ' + data.message));
		$('#main').scrollTop(300);
		getLinks();
	};
});


socket.on('user joined', function (username){
	$('#messages').append($('<div class="user-status"></div>').text(getTime() + ' ' + username + ' joined chat'));
});

socket.on('list', function (data){
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

socket.on('username overlap', function (username){
	alert('username already in use');
});

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
	