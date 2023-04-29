const db = require('../../models');
const currentUser = require('./currentUser');

const fetchAttendance = async (userEmail) => {
	try {
		const userId = await currentUser(userEmail);
		const userAttendanceData = await db.sequelize.query(
			'EXEC dbo.spusers_getuserattendance :userId',
			{
				replacements: { userId: userId }
			}
		);
		return userAttendanceData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchCurrentAttendance = async (userEmail, date) => {
	try {
		const userId = await currentUser(userEmail);
		const currentDate = date;
		const userCurrentAttendanceData = await db.sequelize.query(
			'EXEC dbo.spusers_getusercurrentattendance :userId, :currentDate',
			{
				replacements: { userId: userId, currentDate: currentDate }
			}
		);
		return userCurrentAttendanceData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchAttendance, fetchCurrentAttendance };
