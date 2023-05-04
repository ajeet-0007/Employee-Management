const db = require('../../models');
const getUserTimesheetData = require('../fetchData/userTimesheet');
const currentUser = require('../fetchData/currentUser');
const { getTimesheetWeek } = require('../functions/userTimesheet');

exports.postUserTimesheet = async (req, res) => {
	try {
		const request = req.body;
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		const week = getTimesheetWeek(request.date);
		const submittedHours = request.totalTime;

		const data = await db.sequelize.query(
			'EXEC dbo.spusers_postusertimesheet :userId, :timesheetName, :clientName, :projectName, :jobName, :workItem, :date, :week, :description, :totalTime, :billableStatus, :submittedHours',
			{
				replacements: {
					userId: userId,
					timesheetName: request.timesheetName,
					clientName: request.clientName,
					projectName: request.projectName,
					jobName: request.jobName,
					workItem: request.workItem,
					date: request.date,
					week: week,
					description: request.description,
					totalTime: request.totalTime,
					billableStatus: request.billableStatus,
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

exports.getUserMontlyTimesheets = async (req, res) => {
	
}

exports.getUserSubordinatesTimesheets = async (req, res) => {
	try {
		const currentUserEmail = req.user.userEmail;
		const subordinateTimesheetsData = await getUserTimesheetData.fetchSubordinatesTimesheets(
			currentUserEmail
		);
		if (subordinateTimesheetsData.length == 0) {
			return res.status(404).json({ message: 'No subordinate(s) timesheets found' });
		} else {
			return res.status(200).json({ data: subordinateTimesheetsData });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User subordinate(s) timesheets fetching failed' });
	}
};

exports.updateUserTimesheetRequest = async (req, res) => {
	try {
		const request = req.body;
		const userId = request.userId;
		const timesheetId = request.timesheetId;
		const status = request.status === 'Approve' ? 'Approved' : 'Rejected';
		const data = await db.sequelize.query(
			'EXEC dbo.spusers_updateusertimesheet :userId, :id, :status',
			{
				replacements: {
					userId: userId,
					id: timesheetId,
					status: status
				}
			}
		);
		if (data[1] != 0) {
			return res.status(201).json({ message: 'Timesheet updated successfully' });
		} else {
			return res.status(400).json({ message: 'Timesheet updation failed' });
		}
	} catch (error) {
		console.log(error);
		return res.status(201).json({ message: 'Timesheet updation failed' });
	}
};
