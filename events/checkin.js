const authorize = require('./authorize');
const { getAttendanceTimeDifference, getCurrentAttendance } = require('../controllers/functions/userAttendance');

const userCheckIn = async (socket) => {
	try {
		authorize(socket, () => {
			const userId = socket.user?.userId;
			const intervalId = setInterval(async () => {
				const currentAttendance = await getCurrentAttendance(userId);
				const currentAttendanceStatus = currentAttendance[0]?.status;
				if (currentAttendanceStatus === 'checked-out') {
					clearInterval(intervalId);
				}
				const timeDifference = getAttendanceTimeDifference(currentAttendance[0]?.checkInTime, currentAttendance[0]?.checkInDate);
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
