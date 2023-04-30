const db = require('../../models');
const getUserProfileData = require('../fetchData/userProfile');
const currentUser = require('../fetchData/currentUser');

exports.getUserProfile = async (req, res) => {
	try {
		const currentUserEmail = req.user.userEmail;
		const userProfileData = await getUserProfileData.fetchProfile(currentUserEmail);
		if (userProfileData.length == 0) {
			return res.status(404).json({ message: 'No user profile found' });
		} else {
			return res.status(200).json({ data: userProfileData });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User profile fetching failed' });
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
		return res.status(500).json({ message: 'User profile updation failed' });
	}
};
