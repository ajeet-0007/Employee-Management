const db = require('../../models');

const fetchAttendance = async (userId) => {
	try {
		const userAttendanceData = await db.sequelize.query('EXEC dbo.sp_users_getuserattendance :userId', {
			replacements: { userId: userId }
		});
		return userAttendanceData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchCurrentAttendance = async (userId, date) => {
	try {
		const userCurrentAttendanceData = await db.sequelize.query('EXEC dbo.sp_users_getusercurrentattendance :userId, :currentDate', {
			replacements: { userId: userId, currentDate: date }
		});
		return userCurrentAttendanceData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchAttendance, fetchCurrentAttendance };
