const db = require('../../models');
const currentUser = require('../fetchData/currentUser');

exports.getUserHierarchy = async (req, res) => {
	try {
		const userEmail = req.user.userEmail;
		const userId = await currentUser(userEmail);
		const data = await db.sequelize.query('EXEC dbo.spusers_getuser :userId', {
			replacements: { userId: userId }
		});

		const userReportingManager = data[0][0].reportingManager;
		const userReportingManagerHRMId = data[0][0].reportsTo;
		const userName = data[0][0].name;
		const userHRMId = data[0][0].hrmid;
		const userHierarchyData = await db.sequelize.query(
			'EXEC dbo.spusers_getuserhierarchy :hrmid',
			{
				replacements: { hrmid: userHRMId }
			}
		);
		return res.status(200).json(userHierarchyData);
	} catch (error) {
		console.log(error);

		return res.status(404).json({
			message: 'No hierarchy found'
		});
	}
};
