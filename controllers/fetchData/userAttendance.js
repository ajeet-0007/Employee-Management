const db = require('../../models');

const fetchAttendance = async (userId) => {
	try {
		const userAttendanceData = await db.sequelize.query('EXEC dbo.sp_users_getuserattendance :user_id', {
			replacements: { user_id: userId }
		});
		return userAttendanceData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchCurrentAttendance = async (userId, date) => {
	try {
		const userCurrentAttendanceData = await db.sequelize.query('EXEC dbo.sp_users_getusercurrentattendance :user_id, :current_date', {
			replacements: { user_id: userId, current_date: date }
		});
		return userCurrentAttendanceData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchAttendance, fetchCurrentAttendance };
