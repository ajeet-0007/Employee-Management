const db = require('../../models');
const getUserAttendanceData = require('../fetchData/userAttendance');
const { getCheckInStatus, getCheckOutStatus, getCurrentAttendance } = require('../functions/userAttendance');

exports.postCheckIn = async (req, res) => {
	try {
		const request = req.body;
		const checkInStatus = getCheckInStatus(request.checkInTime, request.checkInDate);
		const currentAttendance = await getCurrentAttendance(req.user.userId);
		if (currentAttendance.length > 0) {
			return res.status(409).json({ message: 'User already checked-in' });
		} else {
			const data = await db.sequelize.query('EXEC dbo.sp_users_postusercheckin :userId, :checkInLocation, :status', {
				replacements: {
					userId: req.user.userId,
					checkInLocation: request.checkInLocation,
					status: 'checked-in'
				}
			});
			return res.status(201).json({
				message: 'User checked-in successfully',
				checkInStatusMessage: checkInStatus
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getUserAttendance = async (req, res) => {
	try {
		const userAttendance = await getUserAttendanceData.fetchAttendance(req.user.userId);
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
		const currentAttendance = await getCurrentAttendance(req.user.userId);
		if (currentAttendance.length == 0) {
			return res.status(404).json({ message: 'No user current attendance found' });
		} else {
			return res.status(200).json(currentAttendance[0]);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.putCheckOut = async (req, res) => {
	try {
		const request = req.body;
		const checkOutStatus = getCheckOutStatus(request.checkOutTime, request.checkOutDate);
		const currentAttendance = await getCurrentAttendance(req.user.userId);
		const checkInTime = currentAttendance[0].checkInTime;
		await db.sequelize.query('EXEC dbo.sp_users_updateusercheckout :userId, :checkOutLocation, :status, :checkInTime', {
			replacements: {
				userId: req.user.userId,
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
