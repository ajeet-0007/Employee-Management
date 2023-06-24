const db = require('../../models');
const getAdminProjectData = require('../fetchData/userProject');
const { fetchCurrentUserProfile } = require('../fetchData/userProfile');
const { findUserProfiles } = require('../functions/userProject');

exports.postProject = async (req, res) => {
	try {
		const request = req.body;
		const projectData = await db.sequelize.query('EXEC dbo.sp_admins_postproject :projectName, :clientName, :assignedOn, :completeBy, :teamHead, :teamMembers, :department', {
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
			for (let i = 0; i < adminProjectData.length; i++) {
				const teamHeadEmail = adminProjectData[i].teamHead;
				adminProjectData[i].teamHead = (await fetchCurrentUserProfile(adminProjectData[i].teamHead))[0];
				adminProjectData[i].teamHead.email = teamHeadEmail.trim();
				adminProjectData[i].teamMembers = await findUserProfiles(adminProjectData[i].teamMembers.split(','));
			}
			return res.status(200).json(adminProjectData);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getProject = async (req, res) => {
	try {
		const adminProjectData = await getAdminProjectData.fetchProject(req.query.projectId);
		if (adminProjectData.length === 0) {
			return res.status(404).json({ message: 'No projects found' });
		} else {
			const teamHeadEmail = adminProjectData[0].teamHead;
			adminProjectData[0].teamHead = (await fetchCurrentUserProfile(adminProjectData[0].teamHead))[0];
			adminProjectData[0].teamHead.email = teamHeadEmail.trim();
			adminProjectData[0].teamMembers = await findUserProfiles(adminProjectData[0].teamMembers.split(','));
			return res.status(200).json(adminProjectData[0]);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.putProject = async (req, res) => {
	try {
		const request = req.body;
		const data = await db.sequelize.query('EXEC dbo.sp_admins_updateproject :projectName, :completeBy, :teamHead, :teamMembers, :status', {
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
			return res.status(404).json({ message: 'Project updation failed' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.deleteProject = async (req, res) => {
	try {
		const request = req.body;
		const data = await db.sequelize.query('EXEC dbo.sp_admins_deleteproject :id', {
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
