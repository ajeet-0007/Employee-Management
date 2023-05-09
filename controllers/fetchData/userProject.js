const db = require('../../models');

const fetchProjects = async (userId) => {
	try {
		const userProjectsData = await db.sequelize.query('EXEC dbo.spusers_getuserprojects :userId', {
			replacements: { userId: userId }
		});
		return userProjectsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchProjectsMinimal = async (userId) => {
	try {
		const userProjectsData = await db.sequelize.query('EXEC dbo.spusers_getuserprojectsminimaldata :userId', {
			replacements: { userId: userId }
		});
		return userProjectsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchProjects, fetchProjectsMinimal };
