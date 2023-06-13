const { fetchCurrentUserProfile } = require('../fetchData/userProfile');
const getUserProjectData = require('../fetchData/userProject');

const findUserProjects = async (userEmail) => {
	const userProjectData = await getUserProjectData.fetchProjects();
	let userProjects = [];
	for (let i = 0; i < userProjectData.length; i++) {
		if (userProjectData[i].team_head === userEmail) {
			userProjects.push(userProjectData[i]);
		} else {
			const members = userProjectData[i].team_members.split(',');
			if (members.includes(userEmail)) {
				userProjects.push(userProjectData[i]);
			}
		}
	}
	return userProjects;
};

const findUserProfiles = async (emailList) => {
	let userProfiles = [];
	for (let i = 0; i < emailList.length; i++) {
		const profile = await fetchCurrentUserProfile(emailList[i]);
		if (profile.length !== 0) {
			userProfiles.push(profile[0]);
		}
	}
	return userProfiles;
};

module.exports = { findUserProjects, findUserProfiles };
