const db = require('../../models');

const currentUser = async (userEmail) => {
	try {
		const currentUser = await db.sequelize.query('EXEC dbo.spusers_getcurrentuser :email', {
			replacements: { email: userEmail }
		});
		if (currentUser[1] == 0) {
			return false;
		} else {
			return currentUser[0][0].id;
		}
	} catch (error) {
		// console.log(error);
		return error;
	}
};

module.exports = currentUser;
