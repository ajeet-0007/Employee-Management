const db = require('../../models');
const currentUser = require('./currentUser');

const fetchTimesheets = async (userEmail) => {
	try {
		const userId = await currentUser(userEmail);
		const userTimesheetsData = await db.sequelize.query(
			'EXEC dbo.spusers_getusertimesheets :userId',
			{
				replacements: { userId: userId }
			}
		);
		return userTimesheetsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchWeeklyTimesheets = async (userEmail, week) => {
	try {
		const userId = await currentUser(userEmail);
		const userTimesheetsData = await db.sequelize.query(
			'EXEC dbo.spusers_getuserweeklytimesheets :userId, :week',
			{
				replacements: { userId: userId, week: week }
			}
		);
		return userTimesheetsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchSubordinatesTimesheets = async (userEmail) => {
	try {
		const currentUser = await db.sequelize.query('EXEC dbo.spusers_getcurrentuser :email', {
			replacements: { email: userEmail }
		});
		const currentUserHrmId = currentUser[0][0].hrmid;
		const subordinateTimesheetsData = await db.sequelize.query(
			'EXEC dbo.spusers_getusersubordinatestimesheets :hrmid',
			{
				replacements: {
					hrmid: currentUserHrmId
				}
			}
		);
		return subordinateTimesheetsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchTimesheets, fetchWeeklyTimesheets, fetchSubordinatesTimesheets };
