const authorize = require('./authorize');

const userCheckOut = async (data, socket) => {
	await authorize(socket, async () => {
		socket.emit('status', {
			status: 'checked-out',
			timeDifference: '00:00:00'
		});
		clearInterval(socket.timer);
		clearInterval(socket.timerConnect);
	});
};

module.exports = userCheckOut;
