const authorize = require('./authorize');
const { getTimeDifference } = require('./message');
const { fetchCurrentAttendance } = require('../controllers/fetchData/userAttendance');

const userCheckIn = async (data, socket) => {
	try {
		await authorize(socket, async () => {
			const email = socket.user?.userEmail;
			const date = new Date().toISOString().slice(0, 10); // 2021-05-05
			fetchCurrentAttendance(email, date).then(async (data) => {
				const interval_id = setInterval(async () => {
					const data_ = await fetchCurrentAttendance(email, date);
					const status_ = data_[0]?.status;
					if (status_ === 'checked-out') {
						clearInterval(interval_id);
					}
					const timeDifference = getTimeDifference(
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
		});
	} catch (error) {
		// console.log(error);
		socket.emit('error', error);
	}
};

module.exports = userCheckIn;