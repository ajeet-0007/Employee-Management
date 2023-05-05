const db = require('../../models');
const userTimesheet = db.userTimesheet;
const getUserTimesheetData = require('../fetchData/userTimesheet');

exports.postUserTimesheet = async (req, res) => {
	try {
		const request = req.body;
		const data = await userTimesheet.bulkCreate(request);
		if (data.length !== 0) {
			return res.status(201).json({ message: 'User timesheet created successfully' });
		} else {
			return res.status(200).json({ message: 'User timesheet creation failed' });
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
