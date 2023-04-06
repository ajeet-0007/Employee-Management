const db = require('../../models');
const User = db.user;
const UserAttendance = db.userAttendance;
const getUserAttendanceData = require('../fetchData/userAttendance');
const currentUser = require('../fetchData/currentUser');

const getCheckinStatus = (time, date) => {
	const date1 = new Date(`${date} ${time}`);
	const date2 = new Date(`${date} 10:30`);
	if (date1.getTime() > date2.getTime()) {
		return 'Late Check-in';
	} else {
		return 'Perfect Check-in';
	}
};

exports.postCheckIn = async (req, res) => {
	try {
		const response = req.body;
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		const checkinStatus = getCheckinStatus(
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
		return res
			.status(201)
			.json({
				message: 'User checked-in successfully',
				checkinStatusMessage: checkinStatus,
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

exports.putCheckOut = async (req, res) => {
	try {
		const response = req.body;
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
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
		return res
			.status(201)
			.json({ message: 'User checked-out successfully' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User check-out failed' });
	}
};
