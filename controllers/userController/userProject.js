const db = require('../../models');
const getUserProjectData = require('../fetchData/userProject');

exports.getUserProjects = async (req, res) => {
	try {
		const currentUserEmail = req.user.userEmail;
		const userProjectData = await getUserProjectData.fetchProjects(currentUserEmail);
		if (userProjectData.length == 0) {
			return res.status(404).json({ message: 'No user projects found' });
		} else {
			return res.status(200).json(userProjectData);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
