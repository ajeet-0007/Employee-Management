const { getUser } = require('../fetchData/user');
const db = require('../../models');

exports.updateUserNotification = async (req, res) => {
	try {
		const request = req.body;
		const userData = await getUser(req.user.userId);
		await db.sequelize.query('EXEC dbo.sp_users_updateusernotification :hrmid, :notificationId', {
			replacements: {
				hrmid: userData.hrmid,
				notificationId: request.notificationId
			}
		});
		return res.status(201).json({ message: 'Notification read' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.updateAllUserNotifications = async (req, res) => {
	try {
		const request = req.body;
		await db.sequelize.query('EXEC dbo.sp_users_updateallusernotifications :hrmid', {
			replacements: { hrmid: request.hrmid }
		});
		return res.status(201).json({ message: 'All Notifications read' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
