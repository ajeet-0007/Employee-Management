require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { currentUser, getUser } = require('../fetchData/user');
const SECRET = process.env.SECRET_KEY;

exports.postLogin = async (req, res) => {
	try {
		const request = req.body;
		const userId = (await currentUser(request.email)).id;
		const user = await getUser(userId);
		if (user[1] != 0) {
			const userCheck = await bcrypt.compare(request.password, user.password);
			if (userCheck) {
				const userEmail = request.email;
				jwt.sign({ userEmail, userId }, SECRET, (error, token) => {
					if (error) {
						console.log(error);
					} else {
						res.status(202).cookie('userToken', token, {
							sameSite: 'none',
							secure: true,
							expires: false,
							maxAge: 1000 * 60 * 60 * 24 * 30,
							httpOnly: true
						});
						res.status(201).json({ message: 'User Logged In Successfully' });
					}
				});
			} else {
				res.status(401).json({ message: 'Invalid Password' });
			}
		} else {
			res.status(404).json({ message: "User doesn't exist" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getLogout = (req, res) => {
	res.clearCookie('userToken');
	res.status(200).json({ message: 'User Logged Out Successfully' });
};
