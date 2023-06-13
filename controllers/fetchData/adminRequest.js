const db = require('../../models');

const fetchMonthlyRequests = async (startDate) => {
	try {
		const requestData = await db.sequelize.query('EXEC dbo.sp_admins_getmonthlyrequests :startDate', {
			replacements: { startDate: startDate }
		});
		return requestData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchMonthlyRequests };
