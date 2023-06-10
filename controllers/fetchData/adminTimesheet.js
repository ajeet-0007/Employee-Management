const db = require('../../models');

const fetchMonthlyTimesheets = async (startDate) => {
	try {
		const timesheetData = await db.sequelize.query('EXEC dbo.spadmins_getmonthlytimesheets :startDate', {
			replacements: { startDate: startDate }
		});
		return timesheetData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchMonthlyTimesheets };
