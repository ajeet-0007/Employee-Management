const { parse } = require('cookie');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET_KEY;

const authorize = async (socket, next) => {
	try {
		if (socket.handshake.headers.cookie) {
			const bearerHeader = socket.handshake.headers.cookie;
			const userToken = parse(bearerHeader).userToken;
			jwt.verify(userToken, SECRET, (error, decoded) => {
				if (error) {
					socket.emit('message', 'Access Denied Error');
				} else {
					socket.user = decoded;
				}
			});
			next();
		} else {
			socket.emit('message', 'Access Denied');
		}
	} catch (error) {
		console.log(error);
		res.json();
	}
};

module.exports = authorize;