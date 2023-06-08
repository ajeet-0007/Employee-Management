const getUserProjectData = require('../fetchData/userProject');

const findUserProjects = async (userEmail) => {
	const userProjectData = await getUserProjectData.fetchProjects();
	let userProjects = [];
	for (let i = 0; i < userProjectData.length; i++) {
		if (userProjectData[i].teamHead === userEmail) {
			userProjects.push(userProjectData[i]);
		} else {
			const members = userProjectData[i].teamMembers.split(',');
			if (members.includes(userEmail)) {
				userProjects.push(userProjectData[i]);
			}
		}
	}
	return userProjects;
};

module.exports = { findUserProjects };
