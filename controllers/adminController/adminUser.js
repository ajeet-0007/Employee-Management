const csv = require('fast-csv');
const db = require('../../models');
const fs = require('fs');
const getUserProfileData = require('../fetchData/userProfile');
const getUserHierarchyData = require('../fetchData/userHierarchy');
const { getCurrentAttendance } = require('../functions/userAttendance');

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
		const userData = await db.sequelize.query('EXEC dbo.spadmins_postuser :hrmid, :name, :email, :phone, :role, :department, :location, :joiningDate, :reportingManager, :reportsTo', {
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
			return res.status(200).json({ message: 'User already exists' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getUsers = async (req, res) => {
	try {
		const adminAllUserData = await db.sequelize.query('EXEC dbo.spadmins_getusers');
		for (let i = 0; i < adminAllUserData[0].length; i++) {
			const attendanceStatus = await getCurrentAttendance(adminAllUserData[0][i].id);
			adminAllUserData[0][i].status = attendanceStatus[0]?.status === undefined ? 'not checked-in' : attendanceStatus[0].status;
		}
		return res.status(200).json(adminAllUserData[0]);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getAllUsers = async (req, res) => {
	try {
		const allUserData = await db.sequelize.query('EXEC dbo.spadmins_getallusers');
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
