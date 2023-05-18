const db = require('../../models');
const userTimesheet = db.userTimesheet;
const getUserTimesheetData = require('../fetchData/userTimesheet');
const { send, sendTo } = require('../../events/sendNotification');

exports.postUserTimesheet = async (req, res) => {
	try {
		const request = JSON.parse(req.body.data);
		const data = await userTimesheet.bulkCreate(request);
		const userData = await db.sequelize.query('EXEC dbo.spusers_getuser :userId', {
			replacements: { userId: req.user.userId }
		});
		const HRM_ID = userData[0][0].hrmid;
		const name = userData[0][0].name;
		const RM_ID = userData[0][0].reportsTo;
		await db.sequelize.query('EXEC dbo.spusers_postnotification :notification_id, :content, :sender, :receiver, :status,:type', {
			replacements: {
				notification_id: randomBytes(16).toString('hex'),
				content: 'A timesheet is waiting for your approval from ' + name,
				sender: HRM_ID,
				receiver: RM_ID,
				status: 'unread',
				type: 'timesheet'
			}
		});
		send(req.io, RM_ID); // send notification to RM
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
		const sender = await getuser(req.user.userId); //user who send the request (RM)
		const senderName = sender.name; //email of the user who send the request (RM)
		const HRM_ID_SENDER = sender.hrmid; //HRM_ID of the user who send the request (RM)
		const user = await getuser(userId);
		const HRM_ID = user.hrmid; //HRM_ID of the user who made the request
		await db.sequelize.query('EXEC dbo.spusers_postnotification :notification_id, :content, :sender, :receiver, :status,:type', {
			replacements: {
				notification_id: randomBytes(16).toString('hex'),
				content: 'Your timesheet has been ' + status + ' by ' + senderName,
				sender: HRM_ID_SENDER,
				receiver: HRM_ID,
				status: 'unread',
				type: 'timesheet'
			}
		});
		sendTo(req.io, HRM_ID); // send notification to HRM
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
