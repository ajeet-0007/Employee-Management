const authorize = require('./authorize');
const currentUser = require('../controllers/fetchData/currentUser');
const { updateUserTimeDifference } = require('./message');
const { getAttendanceTimeDifference } = require('../controllers/functions/userAttendance');
const { fetchCurrentAttendance } = require('../controllers/fetchData/userAttendance');

const userCheckIn = async (data, socket) => {
	try {
		await authorize(socket, async () => {
			const email = socket.user.userEmail;
			const userId = await currentUser(email);
			const date = new Date().toISOString().slice(0, 10); // 2021-05-05
			const interval_id = setInterval(async () => {
				fetchCurrentAttendance(email, date).then(async (data) => {
					const checkinTime = data[0]?.checkInTime;
					const timeDifference = getAttendanceTimeDifference(checkinTime, date);
					const checkInDate = data[0]?.checkInDate;
					await updateUserTimeDifference(userId, checkInDate, timeDifference);
					const data_ = await fetchCurrentAttendance(email, date);
					socket.in(email).emit('message', data_[0]?.timeDifference);
					socket.in(email).emit('status', data_[0]?.status);
				});
			}, 1000);
			socket.timer = interval_id;
		});
	} catch (error) {
		console.log(error);
		socket.emit('error', error);
	}
};

module.exports = userCheckIn;
