const db = require('../../models');

const fetchTimesheets = async (userId) => {
	try {
		const userTimesheetsData = await db.sequelize.query('EXEC dbo.sp_users_getusertimesheets :userId', {
			replacements: { userId: userId }
		});
		return userTimesheetsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchWeeklyTimesheets = async (userId, week) => {
	try {
		const userTimesheetsData = await db.sequelize.query('EXEC dbo.sp_users_getuserweeklytimesheets :userId, :week', {
			replacements: { userId: userId, week: week }
		});
		return userTimesheetsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchSubordinatesTimesheets = async (userId) => {
	try {
		const user = await db.sequelize.query('EXEC dbo.sp_users_getuser :userId', {
			replacements: { userId: userId }
		});
		const subordinateTimesheetsData = await db.sequelize.query('EXEC dbo.sp_users_getusersubordinatestimesheets :hrmid', {
			replacements: {
				hrmid: user[0][0].hrmid
			}
		});
		return subordinateTimesheetsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchTimesheets, fetchWeeklyTimesheets, fetchSubordinatesTimesheets };
