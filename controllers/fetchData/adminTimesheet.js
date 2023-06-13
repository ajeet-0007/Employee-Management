const db = require('../../models');

const fetchMonthlyTimesheets = async (startDate) => {
	try {
		const timesheetData = await db.sequelize.query('EXEC dbo.sp_admins_getmonthlytimesheets :startDate', {
			replacements: { startDate: startDate }
		});
		return timesheetData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchMonthlyTimesheets };
