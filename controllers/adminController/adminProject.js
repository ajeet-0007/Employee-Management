const db = require('../../models');
const getAdminProjectData = require('../fetchData/adminProject');

exports.postProject = async (req, res) => {
	try {
		const request = req.body;
		const projectData = await db.sequelize.query('EXEC dbo.spadmins_postproject :projectName, :clientName, :assignedOn, :completeBy, :teamHead, :teamMembers, :department', {
			replacements: {
				projectName: request.projectName,
				clientName: request.clientName,
				assignedOn: request.assignedOn,
				completeBy: request.completeBy,
				teamHead: request.teamHead,
				teamMembers: request.teamMembers,
				department: request.department
			}
		});
		if (projectData[1] != 0) {
			return res.status(201).json({ message: 'Project added successfully' });
		} else {
			return res.status(200).json({ message: 'Project already exists' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getProjects = async (req, res) => {
	try {
		const adminProjectData = await getAdminProjectData.fetchProjects();
		if (adminProjectData.length === 0) {
			return res.status(404).json({ message: 'No projects found' });
		} else {
			return res.status(200).json(adminProjectData);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.putProject = async (req, res) => {
	try {
		const request = req.body;
		const data = await db.sequelize.query('EXEC dbo.spadmins_updateproject :projectName, :completeBy, :teamHead, :teamMembers, :status', {
			replacements: {
				projectName: request.projectName,
				completeBy: request.completeBy,
				teamHead: request.teamHead,
				teamMembers: request.teamMembers,
				status: request.status
			}
		});
		if (data[1] != 0) {
			return res.status(201).json({ message: 'Project updated successfully' });
		} else {
			return res.status(400).json({ message: 'Project updation failed' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.deleteProject = async (req, res) => {
	try {
		const request = req.body;
		const data = await db.sequelize.query('EXEC dbo.spadmins_deleteproject :id', {
			replacements: {
				id: request.projectId
			}
		});
		if (data[1] != 0) {
			return res.status(201).json({ message: 'Project removed successfully' });
		} else {
			return res.status(400).json({ message: 'Project removal failed' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
