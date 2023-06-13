const db = require('../../models');
const { getUser } = require('../fetchData/user');
const { randomBytes } = require('crypto');

const createTimesheetNotification = async (userId) => {
	const userData = await getUser(userId);
	await db.sequelize.query('EXEC dbo.sp_users_postusernotification :notification_id, :content, :sender, :receiver, :date, :type', {
		replacements: {
			notification_id: randomBytes(16).toString('hex'),
			content: `A timesheet is waiting for your approval from ${userData.name}.`,
			sender: userData.hrmid,
			receiver: userData.reports_to,
			date: new Date(),
			type: 'timesheet'
		}
	});
};

const updateTimesheetNotification = async (senderId, receiverId, status) => {
	const sender = await getUser(senderId); //user who approves the request
	const receiver = await getUser(receiverId); //user who sent the request
	await db.sequelize.query('EXEC dbo.sp_users_postusernotification :notification_id, :content, :sender, :receiver, :date, :type', {
		replacements: {
			notification_id: randomBytes(16).toString('hex'),
			content: `Your timesheet has been ${status.toLowerCase() === 'approve' ? 'approved' : 'rejected'} by ${sender.name}.`,
			sender: sender.hrmid,
			receiver: receiver.hrmid,
			date: new Date(),
			type: 'timesheet'
		}
	});
};

module.exports = { createTimesheetNotification, updateTimesheetNotification };
