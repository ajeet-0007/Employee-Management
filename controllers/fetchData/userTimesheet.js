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

const fetchLatestTimesheets = async (userEmail) => {
	try {
		const userId = await currentUser(userEmail);
		const userLatestTimesheetsData = await db.sequelize.query(
			'EXEC dbo.spusers_getuserlatesttimesheets :userId',
			{
				replacements: { userId: userId }
			}
		);
		return userLatestTimesheetsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

// const fetchWeeklyTimesheets = async (userEmail) => {
//     try {
//         const userId = await currentUser(userEmail);
//         const data = await db.sequelize.query(
//             "EXEC dbo.spusers_getuserweeklytimesheets :userId, :week",
//             {
//                 replacements: { userId: userId },
//             }
//         );
//         return data[0];
//     } catch (error) {
//         console.log(error);
//         return error;
//     }
// };

module.exports = { fetchTimesheets, fetchLatestTimesheets };
