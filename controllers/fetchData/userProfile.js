const db = require('../../models');
const currentUser = require('./currentUser');

const fetchProfile = async (userEmail) => {
	try {
		const userId = await currentUser(userEmail);
		const userProfileData = await db.sequelize.query(
			'EXEC dbo.spusers_getuserprofile :userId',
			{
				replacements: { userId: userId }
			}
		);
		return userProfileData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchProfile };
