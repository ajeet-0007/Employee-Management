const authorize = require('./authorize');
const { getAttendanceTimeDifference } = require('../controllers/functions/userAttendance');
const { fetchCurrentAttendance } = require('../controllers/fetchData/userAttendance');

const userCheckIn = async (socket) => {
	try {
		await authorize(socket, async () => {
			const email = socket.user?.userEmail;
			const date = new Date().toISOString().slice(0, 10);
			const interval_id = setInterval(async () => {
				const data_ = await fetchCurrentAttendance(email, date);
				const status_ = data_[0]?.status;
				if (status_ === 'checked-out') {
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
			socket.timer = interval_id;
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = userCheckIn;
