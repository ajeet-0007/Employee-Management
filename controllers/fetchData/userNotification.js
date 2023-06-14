const db = require('../../models');

const fetchNotifications = async (hrmid) => {
	try {
		const userNotificationData = await db.sequelize.query('EXEC dbo.sp_users_getusernotifications :hrmid', {
			replacements: { hrmid: hrmid }
		});
		return userNotificationData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchNotifications };
