const db = require('../../models');
const currentUser = require('./currentUser');

const fetchAttendance = async (userEmail) => {
	try {
		const userId = await currentUser(userEmail);
		const data = await db.sequelize.query('EXEC dbo.spusers_getuserattendance :userId', {
			replacements: { userId: userId }
		});
		return data[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchCurrentAttendance = async (userEmail, date) => {
	try {
		const userId = await currentUser(userEmail);
		const currentDate = date;
		const data = await db.sequelize.query(
			'EXEC dbo.spusers_getusercurrentattendance :userId, :currentDate',
			{
				replacements: { userId: userId, currentDate: currentDate }
			}
		);
		return data[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchAttendance, fetchCurrentAttendance };
