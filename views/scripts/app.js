import $ from 'jquery';
import io from 'socket.io-client';

import GeminiScrollbar from 'gemini-scrollbar';

new GeminiScrollbar({element: document.querySelector('.js-threads-scroll')}).create();
new GeminiScrollbar({element: document.querySelector('.js-messages-scroll')}).create();

const socket = io('localhost:5000');
// let name;

// $(() => {
// 	$('#messageform').hide();
// });

// $(() => {
// 	$('#messageform').submit(() => {
// 		const messageString = $('#m').val();
// 		if (!messageString) return false;
// 		socket.emit('send_msg', messageString);
// 		$('#m').val('');
// 		return false;
// 	});
// });


$(() => {
	const jsComposer = $('.js-composer');
	jsComposer.submit(e => {
		e.preventDefault();
		const messageString = e.target.message.value;
		if (!messageString) return;
		socket.emit('send_msg', messageString);
		e.target.message.value = '';
	});

	jsComposer.keydown(e => {
		if (e.ctrlKey && e.keyCode === 13) {
			e.preventDefault();
			jsComposer.submit();
		}
	});

});


function getTime() {
	const d = new Date();
	const time = d.getHours() + ':' + d.getMinutes();
	return time;
}

function renderMessageTemplate({avatar, name, time, text}) {
	return `
		<div class="message">
			<div class="message__avatar">
				<avatar src="${avatar}"></avatar>
			</div>
			<div class="message__content">
				<div class="message__name">"${name}"</div>
				<div class="message__time">"${time}"</div>
				<text class="message__text">"${text}"</text>
			</div>
		</div>
	`;
}



// socket.on('message', data => {
// 	if (data.username === name) {
// 		$('#messages').append($('<div class="my_msg"></div>').text(data.message));
// 	} else {
// 		$('#messages').append($('<div class="msg"></div>').text(`${getTime()} ${data.username}: ${data.message}`));
// 	}
// });

socket.on('message', data => {
	$('.js-messages-container').append(renderMessageTemplate({
		text: data.message,
		time: getTime(),
	}));
});


// socket.on('user joined', username => {
// 	$('#messages').append($('<div class="user-status"></div>').text(`${getTime()} ${username} joined chat`));
// });

// socket.on('user left', username => {
// 	$('#messages').append($('<div class="user-status"></div>').text(`${getTime()} ${username} left chat`));
// });

// socket.on('username overlap', username => {
// 	alert(`username ${username} already in use`); // eslint-disable-line no-alert
// });

// $(() => {
// 	$('#loginform').submit(() => {
// 		name = $('#logininput').val();
// 		if (!name) return false;
// 		socket.emit('add user', name);
// 		$('.overlay').fadeOut('slow');
// 		$('#messageform').show();
// 		$('#main').css('margin-top', '1%');
// 		return false;
// 	});
// });
