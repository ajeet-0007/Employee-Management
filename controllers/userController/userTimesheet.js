const db = require('../../models');
const getUserTimesheetData = require('../fetchData/userTimesheet');
const currentUser = require('../fetchData/currentUser');

const getSubmittedHours = (time1, time2, date) => {
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

const getWeek = (date) => {
	const today = new Date(date);
	const firstDay = new Date(
		today.setDate(
			today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1),
		),
	)
		.toISOString()
		.split('T')[0];
	const lastDay = new Date(
		today.setDate(today.getDate() - today.getDay() + 6),
	)
		.toISOString()
		.split('T')[0];
	return firstDay + ' to ' + lastDay;
};

exports.postUserTimesheet = async (req, res) => {
	try {
		const response = req.body;
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		const week = getWeek(response.date);
		const submittedHours = getSubmittedHours(
			response.startTime,
			response.endTime,
			response.date,
		);

		const data = await db.sequelize.query(
			'EXEC dbo.spusers_postusertimesheet :userId, :timesheetName, :clientName, :projectName, :jobName, :workItem, :date, :week, :description, :startTime, :endTime, :billableStatus, :submittedHours',
			{
				replacements: {
					userId: userId,
					timesheetName: response.timesheetName,
					clientName: response.clientName,
					projectName: response.projectName,
					jobName: response.jobName,
					workItem: response.workItem,
					date: response.date,
					week: week,
					description: response.description,
					startTime: response.startTime,
					endTime: response.endTime,
					billableStatus: response.billableStatus,
					submittedHours: submittedHours,
				},
			},
		);
		if (data[1] != 0) {
			return res
				.status(201)
				.json({ message: 'User timesheet created successfully' });
		} else {
			return res
				.status(200)
				.json({ message: 'User timesheet already exists' });
		}
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'User timesheet creation failed' });
	}
};

exports.getUserTimesheets = async (req, res) => {
	try {
		const currentUserEmail = req.user.userEmail;
		const userTimesheetData = await getUserTimesheetData.fetchTimesheets(
			currentUserEmail,
		);
		if (userTimesheetData.length == 0) {
			return res
				.status(404)
				.json({ message: 'No user timesheets found' });
		} else {
			return res.status(200).json({ data: userTimesheetData });
		}
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'User timesheets fetching failed' });
	}
};

exports.getUserLatestTimesheets = async (req, res) => {
	try {
		const currentUserEmail = req.user.userEmail;
		const userLatestTimesheetData =
			await getUserTimesheetData.fetchLatestTimesheets(currentUserEmail);
		if (userLatestTimesheetData.length == 0) {
			return res
				.status(404)
				.json({ message: 'No user timesheets found' });
		} else {
			return res.status(200).json({ data: userLatestTimesheetData });
		}
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'User timesheets fetching failed' });
	}
};
