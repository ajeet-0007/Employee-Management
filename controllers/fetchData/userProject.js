const db = require('../../models');

const fetchProjects = async (userId) => {
	try {
		const userProjectsData = await db.sequelize.query('EXEC dbo.sp_admins_getprojects');
		return userProjectsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchProject = async (projectId) => {
	try {
		const projectData = await db.sequelize.query('EXEC dbo.sp_users_getproject :id', {
			replacements: {
				id: projectId
			}
		});
		return projectData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchProjects, fetchProject };
