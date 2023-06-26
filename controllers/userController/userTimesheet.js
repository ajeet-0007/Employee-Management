const db = require('../../models');
const userTimesheet = db.userTimesheet;
const getUserTimesheetData = require('../fetchData/userTimesheet');
const { send, sendTo } = require('../../events/sendNotification');
const { getUser } = require('../fetchData/user');
const { createTimesheetNotification, updateTimesheetNotification } = require('../functions/userTimesheet');

exports.postUserTimesheet = async (req, res) => {
	try {
		const request = JSON.parse(req.body.data);
		const userTimesheetData = await userTimesheet.bulkCreate(request);

		if (userTimesheetData.length !== 0) {
			const userData = await getUser(req.user.userId);
			await createTimesheetNotification(req.user.userId);
			send(req.io, userData.reportsTo); // send notification to the user who approves the request
			return res.status(201).json({ message: 'User timesheet created successfully' });
		} else {
			return res.status(404).json({ message: 'User timesheet creation failed' });
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

exports.updateUserSubordinateTimesheet = async (req, res) => {
	try {
		const request = req.body;
		const userCurrentRequest = await db.sequelize.query('EXEC dbo.sp_users_getusertimesheet :userId, :id', {
			replacements: { userId: request.userId, id: request.id }
		});
		const updatedData = await db.sequelize.query('EXEC dbo.sp_users_updateusertimesheet :id, :userId, :approvedHours, :status', {
			replacements: {
				id: request.id,
				userId: request.userId,
				approvedHours: request.status === 'Approve' ? userCurrentRequest[0][0].submittedHours : '00:00',
				status: request.status === 'Approve' ? 'Approved' : 'Rejected'
			}
		});

		const receiver = await getUser(request.userId); //user who sent the request
		updateTimesheetNotification(req.user.userId, request.userId, request.status);
		sendTo(req.io, receiver.hrmid); // send notification to the user who sent the request

		if (updatedData[1] != 0) {
			return res.status(201).json({ message: 'Timesheet updated successfully' });
		} else {
			return res.status(404).json({ message: 'Timesheet updation failed' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
