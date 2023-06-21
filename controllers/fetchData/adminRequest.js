const db = require('../../models');

const fetchRangeRequests = async (startDate, endDate) => {
	try {
		const requestData = await db.sequelize.query('EXEC dbo.sp_admins_getrangerequests :startDate, :endDate', {
			replacements: { startDate: startDate, endDate: endDate }
		});
		return requestData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchRangeRequests };
