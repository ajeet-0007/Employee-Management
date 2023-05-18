exports.updateUserNotification = async (req, res) => {
	try {
		const request = req.body;
		await db.sequelize.query('EXEC dbo.spusers_updateusernotification :userId, :notification_id', {
			replacements: {
				userId: req.user.userId,
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
		const request = req.body;
		await db.sequelize.query('EXEC dbo.spusers_updateallusernotifications :userId', {
			replacements: { userId: req.user.userId }
		});
		return res.status(201).json({ message: 'All Notifications read' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
