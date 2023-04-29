const db = require('../../models');
const getUserProjectData = require('../fetchData/userProject');
const currentUser = require('../fetchData/currentUser');

exports.postUserProject = async (req, res) => {
	try {
		const response = req.body;
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		const data = await db.sequelize.query(
			'EXEC dbo.spusers_postuserproject :userId, :projectId, :projectName, :assignedOn, :completeBy, :teamMembers, :teamHead, :department',
			{
				replacements: {
					userId: userId,
					projectId: response.projectId,
					projectName: response.projectName,
					assignedOn: response.assignedOn,
					completeBy: response.completeBy,
					teamMembers: response.teamMembers,
					teamHead: response.teamHead,
					department: response.department
				}
			}
		);
		if (data[1] != 0) {
			return res.status(201).json({ message: 'User project created successfully' });
		} else {
			return res.status(200).json({ message: 'User project already exists' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User project creation failed' });
	}
};

exports.getUserProjects = async (req, res) => {
	try {
		const currentUserEmail = req.user.userEmail;
		const userProjectData = await getUserProjectData.fetchProjects(currentUserEmail);
		if (userProjectData.length == 0) {
			return res.status(404).json({ message: 'No user projects found' });
		} else {
			return res.status(200).json({ data: userProjectData });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User projects fetching failed' });
	}
};
