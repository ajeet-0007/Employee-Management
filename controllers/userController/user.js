const fs = require('fs');
const bcrypt = require('bcrypt');
const db = require('../../models');
const getUserProfileData = require('../fetchData/userProfile');
const getUserHierarchyData = require('../fetchData/userHierarchy');
const { currentUser, getUser } = require('../fetchData/user');

exports.putSignUp = async (req, res) => {
	try {
		const request = req.body;
		const userData = await db.sequelize.query('EXEC dbo.sp_users_getcurrentuser :email', {
			replacements: { email: request.email }
		});
		if (userData[1] != 0) {
			if (userData[0][0].password == null) {
				request.password = await bcrypt.hash(request.password, 10);
				await db.sequelize.query('EXEC sp_users_updateusersignup :name, :email, :password', {
					replacements: {
						name: request.name,
						email: request.email,
						password: request.password
					}
				});

				const userId = (await currentUser(request.email)).id;
				const userData = await db.sequelize.query('EXEC dbo.sp_users_getuser :userId', {
					replacements: { userId: userId }
				});
				const defaultImage = 'data:image/png;base64,' + fs.readFileSync('./assets/profile.png', 'base64');
				const profileData = await db.sequelize.query('EXEC dbo.sp_users_postuserprofile :userId, :profileImage, :hrmid, :name, :permanentAddress, :city, :state, :country, :emergencyPhone', {
					replacements: {
						userId: userId,
						profileImage: defaultImage,
						hrmid: userData[0][0].hrmid,
						name: userData[0][0].name,
						permanentAddress: '',
						city: '',
						state: '',
						country: '',
						emergencyPhone: ''
					}
				});
				const skillsData = await db.sequelize.query('EXEC dbo.sp_users_postuserskills :userId, :primarySkills, :secondarySkills, :certifications', {
					replacements: {
						userId: userId,
						primarySkills: '',
						secondarySkills: '',
						certifications: ''
					}
				});
				return res.status(201).json({ message: 'User created successfully' });
			} else {
				return res.status(403).json({
					message: 'User has already signed up'
				});
			}
		} else {
			return res.status(404).json({
				message: "User doesn't exist in the database"
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Internal Server Error'
		});
	}
};

exports.getUser = async (req, res) => {
	const userData = await getUser(req.user.userId);
	return res.status(200).json(userData);
};

exports.getAllUsers = async (req, res) => {
	try {
		const allUserData = await db.sequelize.query('EXEC dbo.sp_users_getallusers');
		return res.status(200).json(allUserData[0]);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Internal Server Error'
		});
	}
};

exports.getSearchedUser = async (req, res) => {
	try {
		const userData = {};
		const userProfileData = await getUserProfileData.fetchProfile(req.query.userId);
		const userReportingManagerData = await getUserHierarchyData.fetchSuperiorProfile(userProfileData[0].reportsTo);
		const userSubordinateData = await getUserHierarchyData.fetchSubordinateProfile(userProfileData[0].hrmid);
		userData.userId = userProfileData[0].userId;
		userData.hrmid = userProfileData[0].hrmid;
		userData.name = userProfileData[0].name;
		userData.profileImage = userProfileData[0].profileImage;
		userData.phone = userProfileData[0].phone;
		userData.email = userProfileData[0].email;
		userData.role = userProfileData[0].role;
		userData.department = userProfileData[0].department;
		userData.location = userProfileData[0].location;
		if (userReportingManagerData.length !== 0) {
			userData.reportingManager = userReportingManagerData[0];
		}
		if (userSubordinateData.length !== 0) {
			userData.subordinates = userSubordinateData;
		}
		return res.status(200).json(userData);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Internal Server Error'
		});
	}
};
