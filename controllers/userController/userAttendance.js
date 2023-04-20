const db = require('../../models');
const getUserAttendanceData = require('../fetchData/userAttendance');
const currentUser = require('../fetchData/currentUser');
const { getCheckInStatus, getCheckOutStatus } = require('../functions/userAttendance');

exports.postCheckIn = async (req, res) => {
	try {
		const response = req.body;
		const currentDate = new Date().toISOString().slice(0, 10);
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		const checkInStatus = getCheckInStatus(response.checkInTime, response.checkInDate);
		const currentAttendance = await getUserAttendanceData.fetchCurrentAttendance(
			currentUserEmail,
			currentDate
		);
		// if (currentAttendance.length > 0) {
		//   return res.status(409).json({ message: "User already checked-in" });
		// } else {
		const data = await db.sequelize.query(
			'EXEC dbo.spusers_postusercheckin :userId, :checkInTime, :checkInDate, :checkInLocation, :status',
			{
				replacements: {
					userId: userId,
					checkInTime: response.checkInTime,
					checkInDate: response.checkInDate,
					checkInLocation: response.checkInLocation,
					status: 'checked-in'
				}
			}
		);
		return res.status(201).json({
			message: 'User checked-in successfully',
			checkInStatusMessage: checkInStatus
		});
		// }
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User check-in failed' });
	}
};

exports.getUserAttendance = async (req, res) => {
	try {
		const currentUserEmail = req.user.userEmail;
		const userAttendance = await getUserAttendanceData.fetchAttendance(currentUserEmail);
		if (userAttendance.length == 0) {
			return res.status(404).json({ message: 'No user attendance found' });
		} else {
			return res.status(200).json({ data: userAttendance });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User attendance fetching failed' });
	}
};

exports.getUserCurrentAttendance = async (req, res) => {
	try {
		const currentDate = new Date().toISOString().slice(0, 10);
		const currentUserEmail = req.user.userEmail;
		const currentAttendance = await getUserAttendanceData.fetchCurrentAttendance(
			currentUserEmail,
			currentDate
		);
		if (currentAttendance.length == 0) {
			return res.status(404).json({ message: 'No user current attendance found' });
		} else {
			return res.status(200).json({ data: currentAttendance });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'User current attendance fetching failed' });
	}
};

// exports.putCheckOut = async (req, res) => {
// 	try {
// 		const response = req.body;
// 		console.log(response);
// 		const currentUserEmail = req.user.userEmail;
// 		const userId = await currentUser(currentUserEmail);
// 		const checkOutStatus = getCheckOutStatus(response.checkOutTime, response.checkOutDate);
// 		const currentAttendance = await getUserAttendanceData.fetchCurrentAttendance(
// 			currentUserEmail,
// 			new Date().toISOString().slice(0, 10)
// 		);
// 		const checkInTime = currentAttendance[0].checkInTime;
// 		const data = await db.sequelize.query(
// 			'EXEC dbo.spusers_updateusercheckout :userId, :checkOutDate, :checkOutTime, :checkOutLocation, :status, :checkInTime, :timeDifference',
// 			{
// 				replacements: {
// 					userId: userId,
// 					checkOutDate: response.checkOutDate,
// 					checkOutTime: response.checkOutTime,
// 					checkOutLocation: response.checkOutLocation,
// 					status: 'checked-out',
// 					checkInTime: checkInTime,
// 					timeDifference: response.timeDifference
// 				}
// 			}
// 		);
// 		return res.status(201).json({
// 			message: 'User checked-out successfully',
// 			checkOutStatusMessage: checkOutStatus
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		return res.status(500).json({ message: 'User check-out failed' });
// 	}
// };

exports.putCheckOut = async (req, res) => {
	try {
		const response = req.body;

		const currentUserEmail = req.user.userEmail;

		const userId = await currentUser(currentUserEmail);

		const checkOutStatus = getCheckOutStatus(
			response.checkOutTime,

			response.checkOutDate
		);

		const currentAttendance = await getUserAttendanceData.fetchCurrentAttendance(
			currentUserEmail,

			new Date().toISOString().slice(0, 10) // 2021-05-05
		); // if (currentAttendance.length == 0) { //   return res.status(409).json({ message: "User not checked-in" }); // }

		const checkInTime = currentAttendance[0].checkInTime;

		const data = await db.sequelize.query(
			'EXEC dbo.spusers_updateusercheckout :userId, :checkOutDate, :checkOutTime, :checkOutLocation, :status, :checkInTime',

			{
				replacements: {
					userId: userId,

					checkOutDate: response.checkOutDate,

					checkOutTime: response.checkOutTime,

					checkOutLocation: response.checkOutLocation,

					status: 'checked-out',

					checkInTime: checkInTime
				}
			}
		);

		return res.status(201).json({
			message: 'User checked-out successfully',

			checkOutStatusMessage: checkOutStatus
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({ message: 'User check-out failed' });
	}
};
