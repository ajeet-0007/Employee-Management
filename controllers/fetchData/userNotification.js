const db = require('../../models');

const fetchNotifications = async (userId) => {
	try {
		const userNotificationData = await db.sequelize.query('EXEC dbo.spusers_getusernotifications :userId', {
			replacements: { userId: userId }
		});
		return userNotificationData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchNotifications };
