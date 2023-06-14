const db = require('../../models');

const fetchUsers = async () => {
	try {
		const date = new Date().toLocaleDateString('en-GB').split('/');
		const currentDate = date[2] + '-' + date[1] + '-' + date[0];
		const usersData = await db.sequelize.query('EXEC dbo.sp_admins_getusers :currentDate', {
			replacements: { currentDate: currentDate }
		});
		return usersData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchAllUsers = async () => {
	try {
		const allUsersData = await db.sequelize.query('EXEC dbo.sp_admins_getallusers');
		return allUsersData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchUsers, fetchAllUsers };
