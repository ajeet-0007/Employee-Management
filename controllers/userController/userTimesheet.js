const db = require('../../models');
const getUserTimesheetData = require('../fetchData/userTimesheet');
const currentUser = require('../fetchData/currentUser');
const { getTimesheetTimeDifference, getTimesheetWeek } = require('../functions/userTimesheet');

exports.postUserTimesheet = async (req, res) => {
	try {
		const response = req.body;
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		const week = getTimesheetWeek(response.date);
		const submittedHours = getTimesheetTimeDifference(
			response.startTime,
			response.endTime,
			response.date
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
					submittedHours: submittedHours
				}
			}
		);
		if (data[1] != 0) {
			return res.status(201).json({ message: 'User timesheet created successfully' });
		} else {
			return res.status(200).json({ message: 'User timesheet already exists' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User timesheet creation failed' });
	}
};

exports.getUserTimesheets = async (req, res) => {
	try {
		const currentUserEmail = req.user.userEmail;
		const userTimesheetData = await getUserTimesheetData.fetchTimesheets(currentUserEmail);
		if (userTimesheetData.length == 0) {
			return res.status(404).json({ message: 'No user timesheets found' });
		} else {
			return res.status(200).json({ data: userTimesheetData });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User timesheets fetching failed' });
	}
};

exports.getUserLatestTimesheets = async (req, res) => {
	try {
		const currentUserEmail = req.user.userEmail;
		const userLatestTimesheetData = await getUserTimesheetData.fetchLatestTimesheets(
			currentUserEmail
		);
		if (userLatestTimesheetData.length == 0) {
			return res.status(404).json({ message: 'No user timesheets found' });
		} else {
			return res.status(200).json({ data: userLatestTimesheetData });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User timesheets fetching failed' });
	}
};
