const db = require('../../models');

exports.postUserProject = async (req, res) => {
	try {
		const request = req.body;
		const data = await db.sequelize.query(
			'EXEC dbo.spadmins_postuserproject :userEmail, :clientId, :clientName, :projectId, :projectName, :assignedOn, :completeBy, :teamMembers, :teamHead, :department',
			{
				replacements: {
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
			return res.status(201).json({ message: 'User project created successfully' });
		} else {
			return res.status(200).json({ message: 'User project already exists' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User project creation failed' });
	}
};
