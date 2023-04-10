const bcrypt = require('bcrypt');
const db = require('../../models');
const currentUser = require('../fetchData/currentUser');

exports.putSignUp = async (req, res) => {
	try {
		let response = req.body;
		const currentUser = await db.sequelize.query('EXEC dbo.spusers_getcurrentuser :email', {
			replacements: { email: response.email }
		});
		if (currentUser[1] != 0) {
			if (currentUser[0][0].password == null) {
				response.password = await bcrypt.hash(response.password, 10);
				const data = await db.sequelize.query(
					'EXEC spusers_updateusersignup :name, :email, :password',
					{
						replacements: {
							name: response.name,
							email: response.email,
							password: response.password
						}
					}
				);
				return res.status(201).json({ message: 'User created successfully' });
			} else {
				return res.status(403).json({
					message: 'User has already signed up'
				});
			}
		} else {
			return res.status(403).json({
				message: "User doesn't exist in the database"
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'User creation failed'
		});
	}
};

exports.getUser = async (req, res) => {
	try {
		const userEmail = req.user.userEmail;
		const userId = await currentUser(userEmail);
		const data = await db.sequelize.query('EXEC dbo.spusers_getuser :userId', {
			replacements: { userId: userId }
		});
		return res.status(200).json(data[0][0]);
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			message: 'No data available'
		});
	}
};
