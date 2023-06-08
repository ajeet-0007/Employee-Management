const { findUserProjects } = require('../functions/userProject');

exports.getUserProjects = async (req, res) => {
	try {
		const userProjects = await findUserProjects(req.user.userEmail);
		if (userProjects.length === 0) {
			return res.status(404).json({ message: 'No projects found' });
		} else {
			return res.status(200).json(userProjects);
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
