const db = require('../../models');

const fetchSkills = async (userId) => {
	try {
		const userSkillsData = await db.sequelize.query('EXEC dbo.sp_users_getuserskills :userId', {
			replacements: { userId: userId }
		});
		return userSkillsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchSkills };
