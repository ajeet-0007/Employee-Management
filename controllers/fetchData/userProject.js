const db = require('../../models');

const fetchProjects = async (userEmail) => {
	try {
		const userProjectsData = await db.sequelize.query('EXEC dbo.spusers_getuserprojects :userEmail', {
			replacements: { userEmail: userEmail }
		});
		return userProjectsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchProjectsMinimal = async (userEmail) => {
	try {
		const userProjectsData = await db.sequelize.query('EXEC dbo.spusers_getuserprojectsminimaldata :userEmail', {
			replacements: { userEmail: userEmail }
		});
		return userProjectsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchProjects, fetchProjectsMinimal };
