const userCheckInEvent = require('./checkin');
const userCheckOutEvent = require('./checkout');
const authorize = require('./authorize');
const { getAttendanceTimeDifference, getCurrentAttendance } = require('../controllers/functions/userAttendance');

const onConnection = (io) => async (socket) => {
	try {
		authorize(socket, () => {
			// console.log('Client connected: ' + socket.id);
			const userId = socket.user?.userId;
			const intervalId = setInterval(async () => {
				const currentAttendance = await getCurrentAttendance(userId);
				const currentAttendanceStatus = currentAttendance[0]?.status || 'not-checked-in';
				if (currentAttendanceStatus === 'checked-out' || currentAttendanceStatus === 'not-checked-in') {
					clearInterval(intervalId);
				}
				const timeDifference = getAttendanceTimeDifference(currentAttendance[0]?.checkInTime, currentAttendance[0]?.checkInDate);
				socket.emit('status', {
					status: currentAttendanceStatus,
					timeDifference: timeDifference
				});
			}, 1000);
			socket.timerConnect = intervalId;
		});
	} catch (error) {
		console.log(error);
	}
	socket.on('checkedIn', () => {
		socket.broadcast.emit('startClock');
	});
	socket.on('sendNotifications', () => {
		io.emit('notify', 'notified');
	});
	socket.on('join', () => {
		// console.log(data);
	});
	socket.on('checkin', () => userCheckInEvent(socket));
	socket.on('checkout', () => userCheckOutEvent(socket));
	socket.on('disconnect', () => {
		clearInterval(socket?.timer);
		clearInterval(socket?.timerConnect);
		// console.log('Client disconnected');
	});
};

module.exports = { onConnection };
