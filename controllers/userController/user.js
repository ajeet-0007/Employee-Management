const bcrypt = require('bcrypt');
const fs = require('fs');
const db = require('../../models');
const currentUser = require('../fetchData/currentUser');

exports.putSignUp = async (req, res) => {
	try {
		const response = req.body;
		const userData = await db.sequelize.query('EXEC dbo.spusers_getcurrentuser :email', {
			replacements: { email: response.email }
		});
		if (userData[1] != 0) {
			if (userData[0][0].password == null) {
				response.password = await bcrypt.hash(response.password, 10);
				const signupData = await db.sequelize.query(
					'EXEC spusers_updateusersignup :name, :email, :password',
					{
						replacements: {
							name: response.name,
							email: response.email,
							password: response.password
						}
					}
				);
				const userId = await currentUser(response.email);
				const defaultImage =
					'data:image/png;base64,' + fs.readFileSync('./assets/profile.png', 'base64');
				const profileData = await db.sequelize.query(
					'EXEC dbo.spusers_postuserprofile :userId, :profileImage, :permanentAddress, :city, :state, :country, :emergencyPhone',
					{
						replacements: {
							userId: userId,
							profileImage: defaultImage,
							permanentAddress: '',
							city: '',
							state: '',
							country: '',
							emergencyPhone: ''
						}
					}
				);
				const skillsData = await db.sequelize.query(
					'EXEC dbo.spusers_postuserskills :userId, :primarySkills, :secondarySkills, :certifications',
					{
						replacements: {
							userId: userId,
							primarySkills: '',
							secondarySkills: '',
							certifications: ''
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
