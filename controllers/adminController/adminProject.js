const db = require('../../models');
const currentUser = require('../fetchData/user');

exports.postUserProject = async (req, res) => {
	try {
		const request = req.body;
		const userId = await currentUser(request.userEmail);
		const data = await db.sequelize.query(
			'EXEC dbo.spadmins_postuserproject :userId, :userEmail, :clientId, :clientName, :projectId, :projectName, :assignedOn, :completeBy, :teamMembers, :teamHead, :department',
			{
				replacements: {
					userId: userId,
					userEmail: request.userEmail,
					clientId: request.clientId,
					clientName: request.clientName,
					projectId: request.projectId,
					projectName: request.projectName,
					assignedOn: request.assignedOn,
					completeBy: request.completeBy,
					teamMembers: request.teamMembers,
					teamHead: request.teamHead,
					department: request.department
				}
			}
		);
		if (data[1] != 0) {
			return res.status(201).json({ message: 'User added to the project team successfully' });
		} else {
			return res.status(200).json({ message: 'User is already exists in the project team' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
