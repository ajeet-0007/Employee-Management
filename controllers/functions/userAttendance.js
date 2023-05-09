const getUserAttendanceData = require('../fetchData/userAttendance');

const getCheckInStatus = (time, date) => {
	const checkInTime = new Date(`${date} ${time}`);
	const morningTime = new Date(`${date} 10:30:00`);
	if (checkInTime.getTime() > morningTime.getTime()) {
		return 'Late Check-in';
	} else {
		return 'Perfect Check-in';
	}
};

const getCheckOutStatus = (time, date) => {
	const checkOutTime = new Date(`${date} ${time}`);
	const eveningTime = new Date(`${date} 19:00:00`);
	if (checkOutTime.getTime() < eveningTime.getTime()) {
		return 'Early Check-out';
	} else {
		return 'Perfect Check-out';
	}
};

const getCurrentAttendance = async (userId) => {
	const date = new Date().toLocaleDateString('en-GB').split('/');
	const currentDate = date[2] + '-' + date[1] + '-' + date[0];
	const currentAttendance = await getUserAttendanceData.fetchCurrentAttendance(userId, currentDate);
	return currentAttendance;
};

const getAttendanceTimeDifference = (time, date) => {
	const date1 = new Date(`${date} ${time}`);
	const date2 = new Date();
	let diff = Math.abs((date2.getTime() - date1.getTime()) / 1000);
	let seconds = Math.floor(diff) % 60;
	if (seconds < 10 || seconds == 0) {
		seconds = '0' + seconds;
	}
	diff /= 60;
	let minutes = Math.floor(diff) % 60;
	if (minutes < 10 || minutes == 0) {
		minutes = '0' + minutes;
	}
	diff /= 60;
	let hours = Math.floor(diff) % 24;
	if (hours < 10 || hours == 0) {
		hours = '0' + hours;
	}
	return hours + ':' + minutes + ':' + seconds;
};

module.exports = { getCheckInStatus, getCheckOutStatus, getCurrentAttendance, getAttendanceTimeDifference };
