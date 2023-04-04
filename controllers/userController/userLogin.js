const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../models');
const currentUser = require('../fetchData/currentUser');
require('dotenv').config();
const SECRET = process.env.SECRET_KEY;

exports.postLogin = async (req, res) => {
	try {
		const abc = req.body;
		const response = {
			email: req.body.email,
			password: req.body.password,
		};
		const userId = await currentUser(response.email);
		const user = await db.sequelize.query(
			'EXEC dbo.spusers_getuser :userId',
			{
				replacements: { userId: userId },
			},
		);
		if (user[1] != 0) {
			const userCheck = await bcrypt.compare(
				response.password,
				user[0][0].password,
			);
			if (userCheck) {
				const userEmail = user[0][0].email;
				jwt.sign({ userEmail }, SECRET, (error, token) => {
					if (error) {
						console.log(error);
					} else {
						res.status(202).cookie('userToken', token, {
							sameSite: 'none',
							secure: true,
							expires: false,
							maxAge: 1000 * 60 * 60 * 24 * 30,
							httpOnly: true,
						});
						res.status(201).json({ data: user[0][0] });
					}
				});
			} else {
				res.status(401).json({ message: 'Invalid Password' });
			}
		} else {
			res.status(404).json({
				message: "User doesn't exist",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'User login failed' });
	}
};

exports.getLogout = (req, res) => {
	res.clearCookie('userToken');
	res.status(200).json({ message: 'Logged Out Successfully' });
};
