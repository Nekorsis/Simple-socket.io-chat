var socket = io();
var name;
$(function(){
	$('#messageform').hide();
});
$(document).ready(function (){
	$('#messageform').submit(function(){
		var tempstr = $('#m').val();
    	socket.emit('send_msg', tempstr);
    $('#m').val('');
    return false;
  });
});



function getTime(){
	var d = new Date();
	var time = d.getHours() + ":" + d.getMinutes();
	return time;
};

socket.on('message', function (data){
	if ( data.username === name ){
		$('#messages').append($('<div class="my_msg"></div>').text(data.message));
	}
	else {
		$('#messages').append($('<div class="msg"></div>').text(getTime() + ' ' + data.username +  ': ' + data.message));
	};
});

socket.on('user joined', function (username){
	$('#messages').append($('<div class="user-status"></div>').text(getTime() + ' ' + username + ' joined chat'));
});

socket.on('user left', function (username){
	$('#messages').append($('<div class="user-status"></div>').text(getTime() + ' ' + username + ' left chat'));
});

socket.on('username overlap', function (username){
	alert('username already in use');
});

$(function(){
	$('#loginform').submit(function(){
		name = $('#logininput').val();
		socket.emit('add user', name);
		$('.overlay').slideUp("fast");
		$('#messageform').show();
		$('#main').css('margin-top', '1%');
		return false;
	});
});
	