const db = require('../../models');

const fetchAllUsers = async () => {
	try {
		const data = await db.sequelize.query('EXEC dbo.spadmins_getallusers');
		return data[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchAllUsers };
