const db = require('../../models');

const currentUser = async (userEmail) => {
	try {
		const currentUserData = await db.sequelize.query('EXEC dbo.sp_users_getcurrentuser :email', {
			replacements: { email: userEmail }
		});
		if (currentUserData[1] === 0) {
			return false;
		} else {
			return currentUserData[0][0];
		}
	} catch (error) {
		console.log(error);
		return error;
	}
};

const getUser = async (userId) => {
	try {
		const userData = await db.sequelize.query('EXEC dbo.sp_users_getuser :userId', {
			replacements: { userId: userId }
		});
		return userData[0][0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { currentUser, getUser };
