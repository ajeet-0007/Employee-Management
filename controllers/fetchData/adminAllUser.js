const db = require('../../models');

const fetchAllUsers = async () => {
	try {
		const adminAllUsersData = await db.sequelize.query('EXEC dbo.spadmins_getallusers');
		return adminAllUsersData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchAllUsers };
