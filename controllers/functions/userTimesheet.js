const getTimesheetTimeDifference = (time1, time2, date) => {
	const date1 = new Date(`${date} ${time1}`);
	const date2 = new Date(`${date} ${time2}`);
	let diff = Math.abs((date2.getTime() - date1.getTime()) / 1000);
	diff /= 60;
	let minutes = diff % 60;
	if (minutes < 10 || minutes == 0) {
		minutes = '0' + minutes;
	}
	diff /= 60;
	let hours = Math.floor(diff);
	if (hours < 10 || hours == 0) {
		hours = '0' + hours;
	}
	return hours + ':' + minutes;
};

const getTimesheetWeek = (date) => {
	const today = new Date(date);
	const firstDay = new Date(
		today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))
	)
		.toISOString()
		.split('T')[0];
	const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6))
		.toISOString()
		.split('T')[0];
	return firstDay + ' to ' + lastDay;
};

module.exports = { getTimesheetTimeDifference, getTimesheetWeek };
