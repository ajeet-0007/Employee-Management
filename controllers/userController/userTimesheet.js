const db = require('../../models');
const userTimesheet = db.userTimesheet;
const getUserTimesheetData = require('../fetchData/userTimesheet');

exports.postUserTimesheet = async (req, res) => {
	try {
		const request = JSON.parse(req.body.data);
		const data = await userTimesheet.bulkCreate(request);
		if (data.length !== 0) {
			return res.status(201).json({ message: 'User timesheet created successfully' });
		} else {
			return res.status(200).json({ message: 'User timesheet creation failed' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getUserTimesheets = async (req, res) => {
	try {
		const userTimesheetData = await getUserTimesheetData.fetchTimesheets(req.user.userId);
		if (userTimesheetData.length == 0) {
			return res.status(404).json({ message: 'No user timesheets found' });
		} else {
			return res.status(200).json(userTimesheetData);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getUserWeeklyTimesheets = async (req, res) => {
	try {
		const userTimesheetData = await getUserTimesheetData.fetchWeeklyTimesheets(req.user.userId, req.query.week);
		if (userTimesheetData.length == 0) {
			return res.status(404).json({ message: 'No user timesheets found' });
		} else {
			return res.status(200).json(userTimesheetData);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getUserSubordinatesTimesheets = async (req, res) => {
	try {
		const subordinateTimesheetsData = await getUserTimesheetData.fetchSubordinatesTimesheets(req.user.userId);
		if (subordinateTimesheetsData.length == 0) {
			return res.status(404).json({ message: 'No subordinate(s) timesheets found' });
		} else {
			return res.status(200).json(subordinateTimesheetsData);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.updateUserTimesheetRequest = async (req, res) => {
	try {
		const request = req.body;
		const data = await db.sequelize.query('EXEC dbo.spusers_updateusertimesheet :userId, :id, :status', {
			replacements: {
				userId: request.userId,
				id: request.timesheetId,
				status: request.status === 'Approve' ? 'Approved' : 'Rejected'
			}
		});
		if (data[1] != 0) {
			return res.status(201).json({ message: 'Timesheet updated successfully' });
		} else {
			return res.status(400).json({ message: 'Timesheet updation failed' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
