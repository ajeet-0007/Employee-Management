// const db = require('../../models');
// const currentUser = require('../fetchData/currentUser');

// exports.getUserHierarchy = async (req, res) => {
// 	try {
// 		const userEmail = req.user.userEmail;
// 		const userId = await currentUser(userEmail);
// 		const userProfileData = await db.sequelize.query(
// 			'EXEC dbo.spusers_getuserprofile :userId',
// 			{
// 				replacements: { userId: userId }
// 			}
// 		);
// 		const userReportingManagerData = await db.sequelize.query(
// 			'EXEC dbo.spusers_getusersuperiorprofile :hrmid',
// 			{
// 				replacements: { hrmid: userProfileData[0][0].reportsTo }
// 			}
// 		);
// 		const userSubordinateData = await db.sequelize.query(
// 			'EXEC dbo.spusers_getuserhierarchy :hrmid',
// 			{
// 				replacements: { hrmid: userProfileData[0][0].hrmid }
// 			}
// 		);
// 		let chartData = [];
// 		const superiorData = {
// 			id: 1,
// 			pid: 0,
// 			name: userReportingManagerData[0][0].name,
// 			role: userReportingManagerData[0][0].role,
// 			profileImage: userReportingManagerData[0][0].profileImage
// 		};
// 		chartData.push(superiorData);
// 		const userData = {
// 			id: 2,
// 			pid: 1,
// 			name: userProfileData[0][0].name,
// 			role: userProfileData[0][0].role,
// 			profileImage: userProfileData[0][0].profileImage
// 		};
// 		chartData.push(userData);
// 		let subordinateDataId = 3;
// 		if (userSubordinateData[1] !== 0) {
// 			chartData.push({
// 				id: subordinateDataId++,
// 				pid: 2,
// 				tags: ['node-with-subtrees']
// 			});
// 			for (let i = 0; i < userSubordinateData[0].length; i++) {
// 				let subordinateData = {
// 					id: subordinateDataId++,
// 					stpid: 3,
// 					name: userSubordinateData[0][i].name,
// 					role: userSubordinateData[0][i].role,
// 					profileImage: userSubordinateData[0][i].profileImage
// 				};
// 				chartData.push(subordinateData);
// 				subordinateData = {};
// 			}
// 		}
// 		return res.status(200).json(chartData);
// 	} catch (error) {
// 		console.log(error);
// 		return res.status(404).json({ message: 'No hierarchy found' });
// 	}
// };

const db = require('../../models');
const currentUser = require('../fetchData/currentUser');
const fs = require('fs');

exports.getUserHierarchy = async (req, res) => {
	try {
		const userEmail = req.user.userEmail;
		const userId = await currentUser(userEmail);
		const imgString = 'data:image/png;base64,' + fs.readFileSync('profile.png', 'base64');
		const userProfileData = await db.sequelize.query(
			'EXEC dbo.spusers_getuserprofile :userId',
			{
				replacements: { userId: userId }
			}
		);

		const userReportingManagerHRMId = userProfileData[0][0].reportsTo;
		const userHRMId = userProfileData[0][0].hrmid;
		const userReportingManagerData = await db.sequelize.query(
			'EXEC dbo.spusers_getusersuperiorprofile :hrmid',
			{
				replacements: { hrmid: userReportingManagerHRMId }
			}
		);
		const userSubordinateData = await db.sequelize.query(
			'EXEC dbo.spusers_getuserhierarchy :hrmid',
			{
				replacements: { hrmid: userHRMId }
			}
		);

		const chartData = [];
		let superiorData = {};

		if (userReportingManagerData[0][0].profileImage != null) {
			superiorData = {
				id: 1,
				name: userReportingManagerData[0][0].name,
				role: userReportingManagerData[0][0].role,
				profileImage: userReportingManagerData[0][0].profileImage
			};
		} else {
			superiorData = {
				id: 1,
				name: userReportingManagerData[0][0].name,
				role: userReportingManagerData[0][0].role,
				profileImage: imgString
			};
		}

		chartData.push(superiorData);

		let userData = {};
		if (userProfileData[0][0].profileImage !== null) {
			userData = {
				id: 2,
				pid: 1,
				name: userProfileData[0][0].name,
				role: userProfileData[0][0].role,
				profileImage: userProfileData[0][0].profileImage
			};
		} else {
			userData = {
				id: 2,
				pid: 1,
				name: userProfileData[0][0].name,
				role: userProfileData[0][0].role,
				profileImage: imgString
			};
		}

		chartData.push(userData);
		let subordinateDataId = 3;
		if (userSubordinateData[1] !== 0) {
			chartData.push({
				id: subordinateDataId++,
				pid: 2,
				tags: ['node-with-subtrees']
			});

			let subordinateData = {};
			for (let i = 0; i < userSubordinateData[0].length; i++) {
				if (userSubordinateData[0][i].profileImage !== null) {
					subordinateData = {
						id: subordinateDataId++,
						stpid: 3,
						name: userSubordinateData[0][i].name,
						role: userSubordinateData[0][i].role,
						profileImage: userSubordinateData[0][i].profileImage
					};
				} else {
					subordinateData = {
						id: subordinateDataId++,
						stpid: 3,
						name: userSubordinateData[0][i].name,
						role: userSubordinateData[0][i].role,
						profileImage: imgString
					};
				}

				chartData.push(subordinateData);
				subordinateData = {};
			}
		}
		return res.status(200).json(chartData);
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			message: 'No hierarchy found'
		});
	}
};
