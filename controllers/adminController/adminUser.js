const csv = require('fast-csv');
const db = require('../../models');
const fs = require('fs');
const getAllUserData = require('../fetchData/adminAllUser');

const postUploadUserDetails = (req, res) => {
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
					.query(
						'INSERT INTO users (hrmid, name, email, phone, role, reportingManager, location, joiningDate ) VALUES ?',
						{
							replacements: [csvData]
						}
					)
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
		res.status(500).json({ message: 'File upload failed' });
	}
};

const getAllUsers = async (req, res) => {
	try {
		const adminAllUserData = await getAllUserData.fetchAllUsers();
		if (adminAllUserData.length == 0) {
			return res.status(404).json({ message: 'No Users found' });
		} else {
			return res.status(200).json({ data: adminAllUserData });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Users fetching failed' });
	}
};

module.exports = { postUploadUserDetails, getAllUsers };
