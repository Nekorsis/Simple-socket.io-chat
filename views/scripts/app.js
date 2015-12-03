import GeminiScrollbar from 'gemini-scrollbar';
import io from 'socket.io-client';
import Cookie from 'js-cookie';
import $ from 'jquery';

import renderMessageTemplate from '../blocks/message/template.jade';
import renderThreadTemplate from '../blocks/thread/template.jade';


const socket = io('localhost:5000');
const userinfo = {
	name: null,
	avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/mlane/128.jpg',
};

function getTime() {
	const d = new Date();
	const time = d.getHours() + ':' + d.getMinutes();
	return time;
}

const isMe = name => name === userinfo.name;

$(() => {
	const $messagesContainer = $('.js-messages-container');
	const $threadsContainer = $('.js-threads-container');
	const $messagesScroll = $('.js-messages-scroll');
	const $threadsScroll = $('.js-threads-scroll');
	const $loginOverlay = $('.js-login-overlay');
	const $loginForm = $('.js-login-form');
	const $composer = $('.js-composer');

	new GeminiScrollbar({element: $threadsScroll}).create();
	new GeminiScrollbar({element: $messagesScroll}).create();



	// LOGIN

	function login(username) {
		userinfo.name = username;
		socket.emit('add user', userinfo.name);
		Cookie.set('username', userinfo.name);
		$loginOverlay.hide();
	}

	const usernameFromCookies = Cookie.get('username');
	if (usernameFromCookies) {
		login(usernameFromCookies);
	}

	$loginForm.submit(e => {
		e.preventDefault();
		login(e.target.username.value);
		$loginOverlay.fadeOut('slow');
	});

	socket.on('username overlap', username => {
		alert(`username ${username} already in use`); // eslint-disable-line no-alert
	});



	// MAIN

	function scrollToBottom(animate = true) {
		$messagesScroll.animate({scrollTop: $messagesContainer.height()}, !animate && 0);
	}
	scrollToBottom(false);



	// NEW MESSAGE

	$composer.submit(e => {
		e.preventDefault();
		const message = e.target.message.value.trim();
		if (!message) return;
		socket.emit('send_msg', message);
		e.target.message.value = '';
	});

	$composer.keydown(e => {
		if ((e.metaKey || e.ctrlKey) && e.keyCode === 13) {
			e.preventDefault();
			$composer.submit();
		}
	});

	socket.on('message', data => {
		$messagesContainer.append(renderMessageTemplate({
			avatar: userinfo.avatar, // TODO: data.avatar here
			text: data.message,
			time: getTime(),
			name: data.username,
		}));
		if (!isMe(data.username)) {
			$threadsContainer
				.find(`#name_${data.username}`)
				.find('.thread__text')
				.text(data.message);
		}
		scrollToBottom();
	});



	// USER JOIN/LEFT

	socket.on('user joined', username => {
		if (isMe(username)) return;
		$messagesContainer.append($('<div class="user-status"></div>').text(`${getTime()} ${username} joined chat`));
		$threadsContainer.append(renderThreadTemplate({
			avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/_everaldo/128.jpg',
			name: username,
		}));
		scrollToBottom();
	});

	socket.on('user left', username => {
		$messagesContainer.append($('<div class="user-status"></div>').text(`${getTime()} ${username} left chat`));
		$threadsContainer.find(`#name_${username}`).remove();
		scrollToBottom();
	});

});
