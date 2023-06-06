const csv = require('fast-csv');
const db = require('../../models');
const fs = require('fs');

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

exports.getAllUsers = async (req, res) => {
	try {
		const adminAllUserData = await db.sequelize.query('EXEC dbo.spadmins_getallusers');
		return res.status(200).json(adminAllUserData[0]);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
