const authorize = require('./authorize');

const userCheckOut = async (socket) => {
	authorize(socket, () => {
		socket.emit('status', {
			status: 'checked-out',
			timeDifference: '00:00:00'
		});
		clearInterval(socket.timer);
		clearInterval(socket.timerConnect);
	});
};

module.exports = userCheckOut;
