const csv = require('fast-csv');
const db = require('../../models');
const fs = require('fs');
const getAdminUserData = require('../fetchData/adminUser');
const getUserProfileData = require('../fetchData/userProfile');
const getUserHierarchyData = require('../fetchData/userHierarchy');
const getUserSkillsData = require('../fetchData/userSkills');

exports.postUploadUserDetails = (req, res) => {
	try {
		const file = __dirname + '/uploads/' + req.file.filename;
		let stream = fs.createReadStream(file);
		let csvData = [];
		let fileStream = csv
			.parse()
			.on('data', (data) => {
				csvData.push(data);
			})
			.on('end', async () => {
				csvData.shift();
				await db.sequelize
					.query('INSERT INTO users (hrmid, name, email, phone, role, department, location, joiningDate, reportingManager, reportsTo ) VALUES ?', {
						replacements: [csvData]
					})
					.then((data) => {
						return res.status(201).json({
							message: 'File uploaded successfully'
						});
					})
					.catch((error) => {
						return res.status(200).json({
							message: 'The file cannot be uploaded due to uneven data'
						});
					});
				fs.unlinkSync(file);
			});
		stream.pipe(fileStream);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.postUser = async (req, res) => {
	try {
		const request = req.body;
		const userData = await db.sequelize.query('EXEC dbo.sp_admins_postuser :hrmid, :name, :email, :phone, :role, :department, :location, :joiningDate, :reportingManager, :reportsTo', {
			replacements: {
				hrmid: request.hrmid,
				name: request.name,
				email: request.email,
				phone: request.phone,
				role: request.role,
				department: request.department,
				location: request.location,
				joiningDate: request.joiningDate,
				reportingManager: request.reportingManager,
				reportsTo: request.reportsTo
			}
		});
		if (userData[1] != 0) {
			return res.status(201).json({ message: 'User added successfully' });
		} else {
			return res.status(404).json({ message: 'User already exists' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.putUser = async (req, res) => {
	try {
		const request = req.body;
		const userData = await db.sequelize.query('EXEC dbo.sp_admins_updateuser :userId, :role, :department, :location', {
			replacements: {
				userId: request.userId,
				role: request.role,
				department: request.department,
				location: request.location
			}
		});
		if (userData[1] != 0) {
			return res.status(201).json({ message: 'User updated successfully' });
		} else {
			return res.status(404).json({ message: 'User updation failed' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getUsers = async (req, res) => {
	try {
		const usersData = await getAdminUserData.fetchUsers();
		if (usersData.length === 0) {
			return res.status(404).json({ message: 'No users found' });
		} else {
			return res.status(200).json(usersData);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getAllUsers = async (req, res) => {
	try {
		const allUsersData = await getAdminUserData.fetchAllUsers();
		if (allUsersData.length === 0) {
			return res.status(404).json({ message: 'No users found' });
		} else {
			return res.status(200).json(allUsersData);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getSearchedUser = async (req, res) => {
	try {
		const userData = {};
		const userProfileData = await getUserProfileData.fetchProfile(req.query.userId);
		const userReportingManagerData = await getUserHierarchyData.fetchSuperiorProfile(userProfileData[0].reportsTo);
		const userSubordinateData = await getUserHierarchyData.fetchSubordinateProfile(userProfileData[0].hrmid);
		userData.profile = userProfileData[0];
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

exports.getUserSkills = async (req, res) => {
	try {
		const userSkillsData = await getUserSkillsData.fetchSkills(req.query.userId);
		if (userSkillsData.length == 0) {
			return res.status(404).json({ message: 'No user skills found' });
		} else {
			return res.status(200).json(userSkillsData[0]);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
