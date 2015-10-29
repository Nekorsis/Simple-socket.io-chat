var socket = io();
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

socket.on('message', function (data){
	$('#messages').append($('<li>').text(data.username + ': ' + data.message));
});

socket.on('user joined', function (username){
	$('#messages').append($('<li>').text(username + ' joined chat'));
});

socket.on('user left', function (username){
	$('#messages').append($('<li>').text(username + ' left chat'));
});


$(function(){
	$('#loginform').submit(function(){
		var name = $('#logininput').val();
		socket.emit('add user', name);
		$('#loginform').hide();
		$('#messageform').show();
		return false;
	});
});
	