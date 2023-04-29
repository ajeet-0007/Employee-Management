const authorize = require('./authorize');
const { getAttendanceTimeDifference } = require('../controllers/functions/userAttendance');
const { fetchCurrentAttendance } = require('../controllers/fetchData/userAttendance');

const userCheckIn = async (socket) => {
	try {
		await authorize(socket, () => {
			const email = socket.user?.userEmail;
			const date = new Date().toISOString().slice(0, 10);
			const intervalId = setInterval(async () => {
				const currentAttendanceData = await fetchCurrentAttendance(email, date);
				const currentAttendanceStatus = currentAttendanceData[0]?.status;
				if (currentAttendanceStatus === 'checked-out') {
					clearInterval(intervalId);
				}
				const timeDifference = getAttendanceTimeDifference(
					currentAttendanceData[0]?.checkInTime,
					currentAttendanceData[0]?.checkInDate
				);
				socket.emit('status', {
					status: currentAttendanceStatus,
					timeDifference: timeDifference
				});
			}, 1000);
			socket.timer = intervalId;
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = userCheckIn;
