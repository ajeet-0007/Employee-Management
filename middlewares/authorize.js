require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET_KEY;

const userAuthorize = async (req, res, next) => {
	try {
		if (Object.keys(req.cookies).length != 0) {
			const bearerHeader = req.cookies.userToken;
			jwt.verify(bearerHeader, SECRET, (error, decoded) => {
				if (error) {
					res.status(403).json({
						message: 'Access Denied'
					});
				} else {
					req.user = decoded;
				}
			});
			next();
		} else {
			res.status(403).json({
				message: 'Access Denied'
			});
		}
	} catch (error) {
		console.log(error);
		res.json();
	}
};

const adminAuthorize = async (req, res, next) => {
	try {
		if (Object.keys(req.cookies).length != 0) {
			const bearerHeader = req.cookies.adminToken;
			jwt.verify(bearerHeader, SECRET, (error, decoded) => {
				if (error) {
					res.status(403).json({
						message: 'Access Denied'
					});
				} else {
					req.user = decoded;
				}
			});
			next();
		} else {
			res.status(403).json({
				message: 'Access Denied'
			});
		}
	} catch (error) {
		console.log(error);
		res.json();
	}
};

module.exports = { userAuthorize, adminAuthorize };
