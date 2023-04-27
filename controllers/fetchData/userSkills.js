const db = require('../../models');
const currentUser = require('./currentUser');

const fetchSkills = async (userEmail) => {
	try {
		const userId = await currentUser(userEmail);
		const userSkillsData = await db.sequelize.query('EXEC dbo.spusers_getuserskills :userId', {
			replacements: { userId: userId }
		});
		return userSkillsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchSkills };
