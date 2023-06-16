const { fetchCurrentUserProfile } = require('../fetchData/userProfile');
const getUserProjectData = require('../fetchData/userProject');

const findUserProjects = async (userEmail) => {
	const userProjectData = await getUserProjectData.fetchProjects();
	let userProjects = [];
	for (let i = 0; i < userProjectData.length; i++) {
		if (userProjectData[i].teamHead === userEmail) {
			userProjects.push(userProjectData[i]);
		} else {
			const members = userProjectData[i].teamMembers.split(',');
			let teamMembers = [];
			for (let j = 0; j < members.length; j++) {
				teamMembers.push(members[j].trim());
			}
			if (teamMembers.includes(userEmail)) {
				userProjects.push(userProjectData[i]);
			}
		}
	}
	return userProjects;
};

const findUserProfiles = async (emailList) => {
	let userProfiles = [];
	for (let i = 0; i < emailList.length; i++) {
		const profile = await fetchCurrentUserProfile(emailList[i].trim());
		if (profile.length !== 0) {
			profile[0].email = emailList[i].trim();
			userProfiles.push(profile[0]);
		}
	}
	return userProfiles;
};

module.exports = { findUserProjects, findUserProfiles };
