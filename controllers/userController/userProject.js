const { findUserProjects } = require('../functions/userProject');
const { fetchCurrentUserProfile } = require('../fetchData/userProfile');
const { findUserProfiles } = require('../functions/userProject');
const getUserProjectData = require('../fetchData/userProject');

exports.getUserProjects = async (req, res) => {
	try {
		const userProjects = await findUserProjects(req.user.userEmail);
		if (userProjects.length === 0) {
			return res.status(404).json({ message: 'No projects found' });
		} else {
			for (let i = 0; i < userProjects.length; i++) {
				userProjects[i].team_head = (await fetchCurrentUserProfile(userProjects[i].team_head))[0];
				userProjects[i].team_members = await findUserProfiles(userProjects[i].team_members.split(','));
			}
			return res.status(200).json(userProjects);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getProject = async (req, res) => {
	try {
		const userProjectData = await getUserProjectData.fetchProject(req.query.projectId);
		if (userProjectData.length === 0) {
			return res.status(404).json({ message: 'No projects found' });
		} else {
			userProjectData[0].team_head = (await fetchCurrentUserProfile(userProjectData[0].team_head))[0];
			userProjectData[0].team_members = await findUserProfiles(userProjectData[0].team_members.split(','));
			return res.status(200).json(userProjectData[0]);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getUserProjectsMinimalData = async (req, res) => {
	try {
		const userProjects = await findUserProjects(req.user.userEmail);
		if (userProjects.length === 0) {
			return res.status(404).json({ message: 'No projects found' });
		} else {
			let minimalData = [];
			for (let i = 0; i < userProjects.length; i++) {
				minimalData.push({ projectName: userProjects[i].project_name, clientName: userProjects[i].client_name });
			}
			return res.status(200).json(minimalData);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
