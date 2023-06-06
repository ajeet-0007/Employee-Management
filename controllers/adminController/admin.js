const db = require('../../models');
const bcrypt = require('bcrypt');

exports.putSignUp = async (req, res) => {
	try {
		const request = req.body;
		const adminData = await db.sequelize.query('EXEC dbo.spadmins_getcurrentadmin :email', {
			replacements: { email: request.email }
		});
		if (adminData[1] != 0) {
			if (adminData[0][0].password == null) {
				request.password = await bcrypt.hash(request.password, 10);
				await db.sequelize.query('EXEC spadmins_updateadminsignup :name, :email, :password', {
					replacements: {
						name: request.name,
						email: request.email,
						password: request.password
					}
				});
				return res.status(201).json({ message: 'Admin created successfully' });
			} else {
				return res.status(403).json({
					message: 'Admin has already signed up'
				});
			}
		} else {
			return res.status(403).json({
				message: "Admin doesn't exist in the database"
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Internal Server Error'
		});
	}
};
