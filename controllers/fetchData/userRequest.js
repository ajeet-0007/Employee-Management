const db = require('../../models');

const fetchRequests = async (userId) => {
	try {
		const userRequestsData = await db.sequelize.query('EXEC dbo.sp_users_getuserrequests :user_id', {
			replacements: { user_id: userId }
		});
		return userRequestsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchAddedRequests = async (userId) => {
	try {
		const userRequestsData = await db.sequelize.query('EXEC dbo.sp_users_getuseraddedrequests :user_id', {
			replacements: { user_id: userId }
		});
		return userRequestsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchSubordinatesRequests = async (userId) => {
	try {
		const user = await db.sequelize.query('EXEC dbo.sp_users_getuser :user_id', {
			replacements: { user_id: userId }
		});
		const subordinateRequetsData = await db.sequelize.query('EXEC dbo.sp_users_getusersubordinatesrequests :hrmid', {
			replacements: {
				hrmid: user[0][0].hrmid
			}
		});
		return subordinateRequetsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchCurrentRequest = async (userId, requestId) => {
	try {
		const userRequestData = await db.sequelize.query('EXEC dbo.sp_users_getusercurrentrequest :user_id, :id', {
			replacements: { user_id: userId, id: requestId }
		});
		return userRequestData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = {
	fetchRequests,
	fetchAddedRequests,
	fetchCurrentRequest,
	fetchSubordinatesRequests
};
