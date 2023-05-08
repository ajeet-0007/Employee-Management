const db = require('../../models');
const currentUser = require('../fetchData/currentUser');

exports.getUserProfile = async (req, res) => {
	try {
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		const userData = {};
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
		userData.profile = userProfileData[0][0];
		if (userReportingManagerData[0][0] !== null) {
			userData.reportingManager = userReportingManagerData[0][0];
		}
		if (userSubordinateData[0].length !== 0) {
			userData.subordinates = userSubordinateData[0];
		}
		return res.status(200).json([userData]);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.updateUserProfile = async (req, res) => {
	try {
		const request = req.body;
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		const data = await db.sequelize.query(
			'EXEC dbo.spusers_updateuserprofile :userId, :profileImage, :permanentAddress, :city, :state, :country, :emergencyPhone',
			{
				replacements: {
					userId: userId,
					profileImage: request.profileImage,
					permanentAddress: request.permanentAddress,
					city: request.city,
					state: request.state,
					country: request.country,
					emergencyPhone: request.emergencyPhone
				}
			}
		);
		if (data[1] != 0) {
			return res.status(201).json({ message: 'User profile updated successfully' });
		} else {
			return res.status(400).json({ message: 'User profile updation failed' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
