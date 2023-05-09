const db = require('../../models');

const fetchProfile = async (userId) => {
	try {
		const userProfileData = await db.sequelize.query('EXEC dbo.spusers_getuserprofile :userId', {
			replacements: { userId: userId }
		});
		return userProfileData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchProfile };
