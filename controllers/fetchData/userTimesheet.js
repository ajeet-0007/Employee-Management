const db = require('../../models');

const fetchTimesheets = async (userId) => {
	try {
		const userTimesheetsData = await db.sequelize.query('EXEC dbo.sp_users_getusertimesheets :user_id', {
			replacements: { user_id: userId }
		});
		return userTimesheetsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchWeeklyTimesheets = async (userId, week) => {
	try {
		const userTimesheetsData = await db.sequelize.query('EXEC dbo.sp_users_getuserweeklytimesheets :user_id, :week', {
			replacements: { user_id: userId, week: week }
		});
		return userTimesheetsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchSubordinatesTimesheets = async (userId) => {
	try {
		const user = await db.sequelize.query('EXEC dbo.sp_users_getuser :user_id', {
			replacements: { user_id: userId }
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
