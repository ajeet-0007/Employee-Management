const userCheckInEvent = require('./checkin');
const userCheckOutEvent = require('./checkout');
const authorize = require('./authorize');
const { fetchCurrentAttendance } = require('../controllers/fetchData/userAttendance');
const { getAttendanceTimeDifference } = require('../controllers/functions/userAttendance');

const onConnection = (io) => async (socket) => {
	try {
		await authorize(socket, async () => {
			console.log('Client connected: ' + socket.id);
			const email = socket.user?.userEmail;
			const date = new Date().toISOString().slice(0, 10);
			const interval_id = setInterval(async () => {
				const data_ = await fetchCurrentAttendance(email, date);
				const status_ = data_[0]?.status || 'not-checked-in';
				if (status_ === 'checked-out' || status_ === 'not-checked-in') {
					clearInterval(interval_id);
				}
				const timeDifference = getAttendanceTimeDifference(
					data_[0]?.checkInTime,
					data_[0]?.checkInDate
				);
				socket.emit('status', {
					status: status_,
					timeDifference: timeDifference
				});
			}, 1000);
			socket.timerConnect = interval_id;
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
