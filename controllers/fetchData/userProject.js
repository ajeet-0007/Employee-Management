const db = require('../../models');

const fetchProjects = async (userId) => {
	try {
		const userProjectsData = await db.sequelize.query('EXEC dbo.spadmins_getprojects');
		return userProjectsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchProjects };
