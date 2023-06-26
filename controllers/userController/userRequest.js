const db = require('../../models');
const getUserRequestData = require('../fetchData/userRequest');
const { getUser } = require('../fetchData/user');
const { send, sendTo } = require('../../events/sendNotification');
const { getAvailableRequests, createRequestNotification, updateSubordinateRequestNotification, updateRequestNotification, calaculateDays } = require('../functions/userRequest');

exports.postUserRequest = async (req, res) => {
	try {
		const request = req.body;
		const availableRequests = await getAvailableRequests(req.user.userId);
		let leave;
		if (request.request === 'Casual Leave') {
			leave = 'remainingCasualLeaves';
		} else if (request.request === 'Leave Without Pay') {
			leave = 'remainingLeaveWithoutPays';
		} else if (request.request === 'Restricted Holiday') {
			leave = 'remainingRestrictedHolidays';
		} else if (request.request === 'Work From Home') {
			leave = 'remainingWorkFromHomes';
		}
		let days = request.leaveType === 'Full Day' ? calaculateDays(request.startDate, request.endDate) : calaculateDays(request.startDate, request.endDate) * 0.5;
		if (availableRequests[leave] - days >= 0) {
			const data = await db.sequelize.query('EXEC dbo.sp_users_postuserrequest :userId, :email, :startDate, :endDate, :leaveType, :request, :reason', {
				replacements: {
					userId: req.user.userId,
					email: request.email,
					startDate: request.startDate,
					endDate: request.endDate,
					leaveType: request.leaveType,
					request: request.request,
					reason: request.reason
				}
			});

			const userData = await getUser(req.user.userId);
			await createRequestNotification(req.user.userId);
			send(req.io, userData.reportsTo); // send notification to the user who approves the request

			return res.status(201).json({ message: 'User request created successfully' });
		} else {
			return res.status(404).json({ message: `${request.request} request cannot be created, insufficient balance` });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getUserRequests = async (req, res) => {
	try {
		const userRequestData = await getUserRequestData.fetchRequests(req.user.userId);
		if (userRequestData.length === 0) {
			return res.status(404).json({ message: 'No user requests found' });
		} else {
			return res.status(200).json(userRequestData);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getUserSubordinatesRequests = async (req, res) => {
	try {
		const subordinateRequestsData = await getUserRequestData.fetchSubordinatesRequests(req.user.userId);
		if (subordinateRequestsData.length === 0) {
			return res.status(404).json({ message: 'No subordinate(s) requests found' });
		} else {
			return res.status(200).json(subordinateRequestsData);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.updateUserSubordinateRequest = async (req, res) => {
	try {
		const request = req.body;
		const updatedData = await db.sequelize.query('EXEC dbo.sp_users_updateuserrequest :userId, :id, :status', {
			replacements: {
				userId: parseInt(request.userId),
				id: parseInt(request.requestId),
				status: request.status === 'Approve' ? 'Approved' : 'Rejected'
			}
		});

		const receiver = await getUser(request.userId);
		updateSubordinateRequestNotification(req.user.userId, request.userId, request.status);
		sendTo(req.io, receiver.hrmid); // send notification to the user who sent the request

		if (updatedData[1] != 0) {
			return res.status(201).json({ message: 'Request updated successfully' });
		} else {
			return res.status(404).json({ message: 'Request updation failed' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.updateUserRequest = async (req, res) => {
	try {
		const request = req.body;
		const userRequestData = await db.sequelize.query('EXEC dbo.sp_users_updateuserrequest :userId, :id, :status', {
			replacements: {
				userId: req.user.userId,
				id: request.requestId,
				status: 'Cancelled'
			}
		});

		const userData = await getUser(req.user.userId);
		updateRequestNotification(req.user.userId);
		send(req.io, userData.reportsTo);

		if (userRequestData[1] != 0) {
			return res.status(201).json({ message: 'Request updated successfully' });
		} else {
			return res.status(404).json({ message: 'Request updation failed' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.resendUserRequest = async (req, res) => {
	try {
		const request = req.body;
		const userRequestData = await getUserRequestData.fetchCurrentRequest(request.userId, request.requestId);

		if (new Date(userRequestData[0].startDate).getTime() > Date.now()) {
			await db.sequelize.query('EXEC dbo.sp_users_deleteuserrequest :userId, :id', {
				replacements: {
					userId: request.userId,
					id: request.requestId
				}
			});
			await db.sequelize.query('EXEC dbo.sp_users_postuserrequest :userId, :email, :startDate, :endDate, :leaveType, :request, :reason', {
				replacements: {
					userId: userRequestData[0].userId,
					email: userRequestData[0].email,
					startDate: userRequestData[0].startDate,
					endDate: userRequestData[0].endDate,
					leaveType: userRequestData[0].leaveType,
					request: userRequestData[0].request,
					reason: userRequestData[0].reason
				}
			});

			const userData = await getUser(req.user.userId);
			createRequestNotification(req.user.userId);
			send(req.io, userData.reportsTo); // send notification to the user who approves the request

			return res.status(201).json({ message: 'User request recreated successfully' });
		} else {
			return res.status(404).json({ message: 'Please create a new request' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getUserAvailableRequests = async (req, res) => {
	try {
		const availableRequests = await getAvailableRequests(req.user.userId);
		return res.status(200).json(availableRequests);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
