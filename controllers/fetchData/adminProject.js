const db = require('../../models');

const fetchProjects = async () => {
	try {
		const adminProjectsData = await db.sequelize.query('EXEC dbo.spadmins_getallprojects');
		return adminProjectsData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchProjects };
