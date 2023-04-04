const csv = require('fast-csv');
const db = require('../../models');
const fs = require('fs');
const { QueryTypes } = require('sequelize');

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
				await db.sequelize.query(
					'INSERT INTO users (hrmid, name, email, phone, role, reportingManager, location, joiningDate ) VALUES ?',
					{
						replacements: [csvData],
						type: QueryTypes.INSERT,
					},
				);
				fs.unlinkSync(file);
			});
		stream.pipe(fileStream);
		res.status(200).json({ message: 'File uploaded successfully' });
	} catch (error) {
		console.log(error);
		res.status(200).json({ message: 'File upload failed' });
	}
};

module.exports = { postUploadUserDetails };
