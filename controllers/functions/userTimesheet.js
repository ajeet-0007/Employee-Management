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
	return firstDay + ' - ' + lastDay;
};

module.exports = { getTimesheetWeek };
