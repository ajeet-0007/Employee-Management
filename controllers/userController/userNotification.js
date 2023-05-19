const { getUser } = require('../fetchData/user');

exports.updateUserNotification = async (req, res) => {
	try {
		const request = req.body;
		const userData = await getUser(req.user.userId);
		await db.sequelize.query('EXEC dbo.spusers_updateusernotification :hrmid, :notification_id', {
			replacements: {
				hrmid: userData.hrmid,
				notification_id: request.notificationId
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
		const userData = await getUser(req.user.userId);
		await db.sequelize.query('EXEC dbo.spusers_updateallusernotifications :hrmid', {
			replacements: { hrmid: userData.hrmid }
		});
		return res.status(201).json({ message: 'All Notifications read' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
