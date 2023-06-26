const db = require('../../models');

exports.postAdmin = async (req, res) => {
	try {
		const request = req.body;
		const adminData = await db.sequelize.query('EXEC dbo.sp_superadmins_postadmin :hrmid, :name, :email, :phone, :department', {
			replacements: {
				hrmid: request.hrmid,
				name: request.name,
				email: request.email,
				phone: request.phone,
				department: request.department
			}
		});
		if (adminData[1] != 0) {
			return res.status(201).json({ message: 'Admin added successfully' });
		} else {
			return res.status(404).json({ message: 'Admin already exists' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
