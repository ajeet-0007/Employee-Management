const db = require('../../models');
const getUserAttendanceData = require('../fetchData/userAttendance');
const currentUser = require('../fetchData/currentUser');

const getCheckInStatus = (time, date) => {
	const checkInTime = new Date(`${date} ${time}`);
	const morningTime = new Date(`${date} 10:30:00`);
	if (checkInTime.getTime() > morningTime.getTime()) {
		return 'Late Check-in';
	} else {
		return 'Perfect Check-in';
	}
};

const getCheckOutStatus = (time, date) => {
	const checkOutTime = new Date(`${date} ${time}`);
	const eveningTime = new Date(`${date} 19:00:00`);
	if (checkOutTime.getTime() < eveningTime.getTime()) {
		return 'Early Check-out';
	} else {
		return 'Perfect Check-out';
	}
};

exports.postCheckIn = async (req, res) => {
	try {
		const response = req.body;
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		const checkInStatus = getCheckInStatus(
			response.checkInTime,
			response.checkInDate,
		);
		const data = await db.sequelize.query(
			'EXEC dbo.spusers_postusercheckin :userId, :checkInTime, :checkInDate, :checkInLocation',
			{
				replacements: {
					userId: userId,
					checkInTime: response.checkInTime,
					checkInDate: response.checkInDate,
					checkInLocation: response.checkInLocation,
				},
			},
		);
		return res.status(201).json({
			message: 'User checked-in successfully',
			checkInStatusMessage: checkInStatus,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User check-in failed' });
	}
};

exports.getUserAttendance = async (req, res) => {
	try {
		const currentUserEmail = req.user.userEmail;
		const userAttendanceData = await getUserAttendanceData.fetchAttendance(
			currentUserEmail,
		);
		if (userAttendanceData.length == 0) {
			return res
				.status(404)
				.json({ message: 'No user attendance found' });
		} else {
			return res.status(200).json({ data: userAttendanceData });
		}
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'User attendance fetching failed' });
	}
};

exports.getUserCurrentAttendance = async (req, res) => {
	try {
		const currentDate = new Date().toLocaleDateString();
		const currentUserEmail = req.user.userEmail;
		const userCurrentAttendanceData =
			await getUserAttendanceData.fetchCurrentAttendance(
				currentUserEmail,
				currentDate,
			);
		if (userCurrentAttendanceData.length == 0) {
			return res
				.status(404)
				.json({ message: 'No user current attendance found' });
		} else {
			return res.status(200).json({ data: userCurrentAttendanceData });
		}
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'User current attendance fetching failed' });
	}
};

exports.putCheckOut = async (req, res) => {
	try {
		const response = req.body;
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		const checkOutStatus = getCheckOutStatus(
			response.checkOutTime,
			response.checkOutDate,
		);
		const data = await db.sequelize.query(
			'EXEC dbo.spusers_updateusercheckout :userId, :checkOutDate, :checkOutTime, :checkOutLocation',
			{
				replacements: {
					userId: userId,
					checkOutDate: response.checkOutDate,
					checkOutTime: response.checkOutTime,
					checkOutLocation: response.checkOutLocation,
				},
			},
		);
		return res.status(201).json({
			message: 'User checked-out successfully',
			checkOutStatusMessage: checkOutStatus,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User check-out failed' });
	}
};
