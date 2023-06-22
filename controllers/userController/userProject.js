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
				const teamHeadEmail = userProjects[i].teamHead;
				userProjects[i].teamHead = (await fetchCurrentUserProfile(userProjects[i].teamHead))[0];
				userProjects[i].teamHead.email = teamHeadEmail.trim();
				userProjects[i].teamMembers = await findUserProfiles(userProjects[i].teamMembers.split(','));
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
			const teamHeadEmail = userProjectData[0].teamHead;
			userProjectData[0].teamHead = (await fetchCurrentUserProfile(userProjectData[0].teamHead))[0];
			userProjectData[0].teamHead.email = teamHeadEmail.trim();
			userProjectData[0].teamMembers = await findUserProfiles(userProjectData[0].teamMembers.split(','));
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
				minimalData.push({ projectName: userProjects[i].projectName, clientName: userProjects[i].clientName });
			}
			return res.status(200).json(minimalData);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
