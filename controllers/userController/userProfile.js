const db = require('../../models');
const getUserProfileData = require('../fetchData/userProfile');
const currentUser = require('../fetchData/currentUser');
// var fs = require('fs');
const path = require('path');

exports.postUserProfile = async (req, res) => {
	try {
		const response = req.body;
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		// const filePath = path.join(__dirname, '.', 'uploads', req.file.filename);
		// const imageAsBase64 = fs.readFileSync(filePath, 'base64');
		// fs.unlinkSync(filePath);

		const data = await db.sequelize.query(
			'EXEC dbo.spusers_postuserprofile :userId, :profileImage, :permanentAddress, :city, :state, :country, :emergencyPhone',
			{
				replacements: {
					userId: userId,
					profileImage: response.profileImage,
					permanentAddress: response.permanentAddress,
					city: response.city,
					state: response.state,
					country: response.country,
					emergencyPhone: response.emergencyPhone
				}
			}
		);
		if (data[1] != 0) {
			return res.status(201).json({ message: 'User profile created successfully' });
		} else {
			return res.status(200).json({ message: 'User profile already exists' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User profile creation failed' });
	}
};

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
		const response = req.body;
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		// const img = response.profileImage;
		// for (let i = 0; i < img.size(); i++) {
		// 	console.log(img[i]);
		// }
		// const filePath = path.join(__dirname, '.', 'uploads', req.file.filename);
		// const imageAsBase64 = fs.readFileSync(filePath, 'base64');
		// fs.unlinkSync(filePath);
		const data = await db.sequelize.query(
			'EXEC dbo.spusers_updateuserprofile :userId, :profileImage, :permanentAddress, :city, :state, :country, :emergencyPhone',
			{
				replacements: {
					userId: userId,
					profileImage: response.profileImage,
					permanentAddress: response.permanentAddress,
					city: response.city,
					state: response.state,
					country: response.country,
					emergencyPhone: response.emergencyPhone
				}
			}
		);
		return res.status(201).json({ message: 'User profile updated successfully' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User profile updation failed' });
	}
};
