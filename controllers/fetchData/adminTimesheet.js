const db = require('../../models');

const fetchRangeTimesheets = async (startDate, endDate) => {
	try {
		const timesheetData = await db.sequelize.query('EXEC dbo.sp_admins_getrangetimesheets :startDate, :endDate', {
			replacements: { startDate: startDate, endDate: endDate }
		});
		return timesheetData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchRangeTimesheets };
