const db = require('../../models');
const getUserAttendanceData = require('../fetchData/userAttendance');
const currentUser = require('../fetchData/currentUser');
const { getCheckInStatus, getCheckOutStatus } = require('../functions/userAttendance');

exports.postCheckIn = async (req, res) => {
	try {
		const request = req.body;
		const date = new Date().toLocaleDateString('en-GB').split('/');
		const currentDate = date[2] + '-' + date[1] + '-' + date[0];
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		const checkInStatus = getCheckInStatus(request.checkInTime, request.checkInDate);
		const currentAttendance = await getUserAttendanceData.fetchCurrentAttendance(currentUserEmail, currentDate);
		// if (currentAttendance.length > 0) {
		//   return res.status(409).json({ message: "User already checked-in" });
		// } else {
		const data = await db.sequelize.query('EXEC dbo.spusers_postusercheckin :userId, :checkInLocation, :status', {
			replacements: {
				userId: userId,
				checkInLocation: request.checkInLocation,
				status: 'checked-in'
			}
		});
		return res.status(201).json({
			message: 'User checked-in successfully',
			checkInStatusMessage: checkInStatus
		});
		// }
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getUserAttendance = async (req, res) => {
	try {
		const currentUserEmail = req.user.userEmail;
		const userAttendance = await getUserAttendanceData.fetchAttendance(currentUserEmail);
		if (userAttendance.length == 0) {
			return res.status(404).json({ message: 'No user attendance found' });
		} else {
			return res.status(200).json(userAttendance);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getUserCurrentAttendance = async (req, res) => {
	try {
		const date = new Date().toLocaleDateString('en-GB').split('/');
		const currentDate = date[2] + '-' + date[1] + '-' + date[0];
		const currentUserEmail = req.user.userEmail;
		const currentAttendance = await getUserAttendanceData.fetchCurrentAttendance(currentUserEmail, currentDate);
		if (currentAttendance.length == 0) {
			return res.status(404).json({ message: 'No user current attendance found' });
		} else {
			return res.status(200).json({ data: currentAttendance });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.putCheckOut = async (req, res) => {
	try {
		const request = req.body;
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		const checkOutStatus = getCheckOutStatus(request.checkOutTime, request.checkOutDate);
		const date = new Date().toLocaleDateString('en-GB').split('/');
		const currentDate = date[2] + '-' + date[1] + '-' + date[0];
		const currentAttendance = await getUserAttendanceData.fetchCurrentAttendance(currentUserEmail, currentDate);
		const checkInTime = currentAttendance[0].checkInTime;
		const data = await db.sequelize.query('EXEC dbo.spusers_updateusercheckout :userId, :checkOutLocation, :status, :checkInTime', {
			replacements: {
				userId: userId,
				checkOutLocation: request.checkOutLocation,
				status: 'checked-out',
				checkInTime: checkInTime
			}
		});
		return res.status(201).json({
			message: 'User checked-out successfully',
			checkOutStatusMessage: checkOutStatus
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
