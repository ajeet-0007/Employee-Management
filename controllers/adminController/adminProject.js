const db = require('../../models');
const getAdminProjectData = require('../fetchData/userProject');
const { fetchCurrentUserProfile } = require('../fetchData/userProfile');
const { findUserProfiles } = require('../functions/userProject');

exports.postProject = async (req, res) => {
	try {
		const request = req.body;
		const projectData = await db.sequelize.query('EXEC dbo.sp_admins_postproject :project_name, :client_name, :assigned_on, :complete_by, :team_head, :team_members, :department', {
			replacements: {
				project_name: request.projectName,
				client_name: request.clientName,
				assigned_on: request.assignedOn,
				complete_by: request.completeBy,
				team_head: request.teamHead,
				team_members: request.teamMembers,
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
				adminProjectData[i].team_head = (await fetchCurrentUserProfile(adminProjectData[i].team_head))[0];
				adminProjectData[i].team_members = await findUserProfiles(adminProjectData[i].team_members.split(','));
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
			adminProjectData[0].team_head = (await fetchCurrentUserProfile(adminProjectData[0].team_head))[0];
			adminProjectData[0].team_members = await findUserProfiles(adminProjectData[0].team_members.split(','));
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
		const data = await db.sequelize.query('EXEC dbo.sp_admins_updateproject :project_name, :complete_by, :team_head, :team_members, :status', {
			replacements: {
				project_name: request.projectName,
				complete_by: request.completeBy,
				team_head: request.teamHead,
				team_members: request.teamMembers,
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
