import $ from 'jquery';
import io from 'socket.io';

import GeminiScrollbar from 'gemini-scrollbar';

new GeminiScrollbar({element: document.querySelector('.js-threads-scroll')}).create();
new GeminiScrollbar({element: document.querySelector('.js-messages-scroll')}).create();

const socket = io();
let name;

$(() => {
	$('#messageform').hide();
});

$(() => {
	$('#messageform').submit(() => {
		const messageString = $('#m').val();
		if (!messageString) return false;
		socket.emit('send_msg', messageString);
		$('#m').val('');
		return false;
	});
});



function getTime() {
	const d = new Date();
	const time = d.getHours() + ':' + d.getMinutes();
	return time;
}

socket.on('message', data => {
	if (data.username === name) {
		$('#messages').append($('<div class="my_msg"></div>').text(data.message));
	} else {
		$('#messages').append($('<div class="msg"></div>').text(`${getTime()} ${data.username}: ${data.message}`));
	}
});


socket.on('user joined', username => {
	$('#messages').append($('<div class="user-status"></div>').text(`${getTime()} ${username} joined chat`));
});

socket.on('user left', username => {
	$('#messages').append($('<div class="user-status"></div>').text(`${getTime()} ${username} left chat`));
});

socket.on('username overlap', username => {
	alert(`username ${username} already in use`); // eslint-disable-line no-alert
});

$(() => {
	$('#loginform').submit(() => {
		name = $('#logininput').val();
		if (!name) return false;
		socket.emit('add user', name);
		$('.overlay').fadeOut('slow');
		$('#messageform').show();
		$('#main').css('margin-top', '1%');
		return false;
	});
});
