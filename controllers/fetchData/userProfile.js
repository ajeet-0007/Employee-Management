const db = require('../../models');

const fetchProfile = async (userId) => {
	try {
		const userProfileData = await db.sequelize.query('EXEC dbo.sp_users_getuserprofile :userId', {
			replacements: { userId: userId }
		});
		return userProfileData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchCurrentUserProfile = async (email) => {
	try {
		const userProfileData = await db.sequelize.query('EXEC dbo.sp_users_getcurrentuserprofile :email', {
			replacements: { email: email }
		});
		return userProfileData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchProfile, fetchCurrentUserProfile };
