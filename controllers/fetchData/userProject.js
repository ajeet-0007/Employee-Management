const db = require('../../models');
const currentUser = require('./currentUser');

const fetchProjects = async (userEmail) => {
	try {
		const userId = await currentUser(userEmail);
		const userProjectsData = await db.sequelize.query(
			'EXEC dbo.spusers_getuserprojects :userId',
			{
				replacements: { userId: userId }
			}
		);
		return userProjectsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchProjects };
