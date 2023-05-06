const userCheckInEvent = require('./checkin');
const userCheckOutEvent = require('./checkout');
const authorize = require('./authorize');
const { fetchCurrentAttendance } = require('../controllers/fetchData/userAttendance');
const { getAttendanceTimeDifference } = require('../controllers/functions/userAttendance');

const onConnection = (io) => async (socket) => {
	try {
		authorize(socket, () => {
			// console.log('Client connected: ' + socket.id);
			const email = socket.user?.userEmail;
			const date = new Date().toLocaleDateString('en-GB').split('/');
			const currentDate = date[2] + '-' + date[1] + '-' + date[0];
			const intervalId = setInterval(async () => {
				const currentAttendanceData = await fetchCurrentAttendance(email, currentDate);
				const currentAttendanceStatus = currentAttendanceData[0]?.status || 'not-checked-in';
				if (currentAttendanceStatus === 'checked-out' || currentAttendanceStatus === 'not-checked-in') {
					clearInterval(intervalId);
				}
				const timeDifference = getAttendanceTimeDifference(currentAttendanceData[0]?.checkInTime, currentAttendanceData[0]?.checkInDate);
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
	socket.on('checkin', () => userCheckInEvent(socket));
	socket.on('checkout', () => userCheckOutEvent(socket));
	socket.on('disconnect', () => {
		clearInterval(socket?.timer);
		clearInterval(socket?.timerConnect);
		// console.log('Client disconnected');
	});
};

module.exports = { onConnection };
