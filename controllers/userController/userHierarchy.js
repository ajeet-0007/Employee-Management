const db = require('../../models');
const currentUser = require('../fetchData/currentUser');

exports.getUserHierarchy = async (req, res) => {
	try {
		const userEmail = req.user.userEmail;
		const userId = await currentUser(userEmail);
		const userProfileData = await db.sequelize.query(
			'EXEC dbo.spusers_getuserprofile :userId',
			{
				replacements: { userId: userId }
			}
		);
		const userReportingManagerData = await db.sequelize.query(
			'EXEC dbo.spusers_getusersuperiorprofile :hrmid',
			{
				replacements: { hrmid: userProfileData[0][0].reportsTo }
			}
		);
		const userSubordinateData = await db.sequelize.query(
			'EXEC dbo.spusers_getusersubordinates :hrmid',
			{
				replacements: { hrmid: userProfileData[0][0].hrmid }
			}
		);
		let chartData = [];
		if (userReportingManagerData[1] !== 0) {
			const superiorData = {
				id: 1,
				pid: 0,
				name: userReportingManagerData[0][0].name,
				role: userReportingManagerData[0][0].role,
				profileImage: userReportingManagerData[0][0].profileImage
			};
			chartData.push(superiorData);
		}
		const userData = {
			id: 2,
			pid: 1,
			name: userProfileData[0][0].name,
			role: userProfileData[0][0].role,
			profileImage: userProfileData[0][0].profileImage
		};
		chartData.push(userData);
		let subordinateDataId = 3;
		if (userSubordinateData[1] !== 0) {
			chartData.push({
				id: subordinateDataId++,
				pid: 2,
				tags: ['node-with-subtrees']
			});
			for (let i = 0; i < userSubordinateData[0].length; i++) {
				let subordinateData = {
					id: subordinateDataId++,
					stpid: 3,
					name: userSubordinateData[0][i].name,
					role: userSubordinateData[0][i].role,
					profileImage: userSubordinateData[0][i].profileImage
				};
				chartData.push(subordinateData);
				subordinateData = {};
			}
		}
		return res.status(200).json(chartData);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: 'No hierarchy found' });
	}
};
