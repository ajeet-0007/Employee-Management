const getUserProfileData = require('../fetchData/userProfile');
const getUserHierarchyData = require('../fetchData/userHierarchy');

exports.getUserHierarchy = async (req, res) => {
	try {
		const userProfileData = await getUserProfileData.fetchProfile(req.query.userId);
		const userReportingManagerData = await getUserHierarchyData.fetchSuperiorProfile(userProfileData[0].reportsTo);
		const userSubordinateData = await getUserHierarchyData.fetchSubordinateProfile(userProfileData[0].hrmid);
		let chartData = [];
		if (userReportingManagerData.length !== 0) {
			const superiorData = {
				id: 1,
				pid: 0,
				name: userReportingManagerData[0].name,
				role: userReportingManagerData[0].role,
				profileImage: userReportingManagerData[0].profileImage
			};
			chartData.push(superiorData);
		}
		const userData = {
			id: 2,
			pid: 1,
			name: userProfileData[0].name,
			role: userProfileData[0].role,
			profileImage: userProfileData[0].profileImage
		};
		chartData.push(userData);
		let subordinateDataId = 3;
		if (userSubordinateData.length !== 0) {
			chartData.push({
				id: subordinateDataId++,
				pid: 2,
				tags: ['node-with-subtrees']
			});
			for (let i = 0; i < userSubordinateData.length; i++) {
				let subordinateData = {
					id: subordinateDataId++,
					stpid: 3,
					name: userSubordinateData[i].name,
					role: userSubordinateData[i].role,
					profileImage: userSubordinateData[i].profileImage
				};
				chartData.push(subordinateData);
				subordinateData = {};
			}
		}
		return res.status(200).json(chartData);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
