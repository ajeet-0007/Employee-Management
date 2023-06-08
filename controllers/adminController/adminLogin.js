require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { currentAdmin, getAdmin } = require('../fetchData/admin');
const SECRET = process.env.SECRET_KEY;

exports.postLogin = async (req, res) => {
	try {
		const request = req.body;
		const adminId = (await currentAdmin(request.email)).id;
		const admin = await getAdmin(adminId);
		if (admin[1] != 0) {
			const adminCheck = await bcrypt.compare(request.password, admin.password);
			if (adminCheck) {
				const adminEmail = request.email;
				jwt.sign({ adminEmail, adminId }, SECRET, (error, token) => {
					if (error) {
						console.log(error);
					} else {
						res.status(202).cookie('adminToken', token, {
							sameSite: 'none',
							secure: true,
							expires: false,
							maxAge: 1000 * 60 * 60 * 24 * 30,
							httpOnly: true
						});
						res.status(201).json({ message: 'Admin Logged In Successfully' });
					}
				});
			} else {
				res.status(401).json({ message: 'Invalid Password' });
			}
		} else {
			res.status(404).json({ message: "Admin doesn't exist" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getLogout = (req, res) => {
	res.clearCookie('adminToken');
	res.status(200).json({ message: 'Admin Logged Out Successfully' });
};
