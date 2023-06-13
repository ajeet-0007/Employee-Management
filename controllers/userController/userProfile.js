const db = require('../../models');
const getUserProfileData = require('../fetchData/userProfile');
const getUserHierarchyData = require('../fetchData/userHierarchy');

exports.getUserProfile = async (req, res) => {
	try {
		const userData = {};
		const userProfileData = await getUserProfileData.fetchProfile(req.user.userId);
		const userReportingManagerData = await getUserHierarchyData.fetchSuperiorProfile(userProfileData[0].reports_to);
		const userSubordinateData = await getUserHierarchyData.fetchSubordinateProfile(userProfileData[0].hrmid);
		userData.profile = userProfileData[0];
		if (userReportingManagerData.length !== 0) {
			userData.reportingmanager = userReportingManagerData[0];
		}
		if (userSubordinateData.length !== 0) {
			userData.subordinates = userSubordinateData;
		}
		return res.status(200).json(userData);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.updateUserProfile = async (req, res) => {
	try {
		const request = req.body;
		const data = await db.sequelize.query('EXEC dbo.sp_users_updateuserprofile :user_id, profile_image, :permanent_address, :city, :state, :country, :emergency_phone', {
			replacements: {
				user_id: req.user.userId,
				profile_image: request.profileImage,
				permanent_address: request.permanentAddress,
				city: request.city,
				state: request.state,
				country: request.country,
				emergency_phone: request.emergencyPhone
			}
		});
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
