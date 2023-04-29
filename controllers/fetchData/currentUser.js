const db = require('../../models');

const currentUser = async (userEmail) => {
	try {
		const currentUserData = await db.sequelize.query('EXEC dbo.spusers_getcurrentuser :email', {
			replacements: { email: userEmail }
		});
		if (currentUserData[1] == 0) {
			return false;
		} else {
			return currentUserData[0][0].id;
		}
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = currentUser;
