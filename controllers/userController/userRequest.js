const db = require('../../models');
const getUserRequestData = require('../fetchData/userRequest');
const { getAvailableRequests } = require('../functions/userRequest');

exports.postUserRequest = async (req, res) => {
	try {
		const request = req.body;
		const availableRequests = await getAvailableRequests(req.user.userId);
		let leave;
		if (request.request === 'Casual Leave') {
			leave = 'casualLeave';
		} else if (request.request === 'Leave Without Pay') {
			leave = 'leaveWithoutPay';
		} else if (request.request === 'Restricted Holiday') {
			leave = 'restrictedHoliday';
		} else if (request.request === 'Work From Home') {
			leave = 'workFromHome';
		}
		if (availableRequests[leave] > 0) {
			const data = await db.sequelize.query('EXEC dbo.spusers_postuserrequest :userId, :email, :startDate, :endDate, :leaveType, :request, :reason', {
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
			return res.status(201).json({ message: 'User request created successfully' });
		} else {
			return res.status(200).json({ message: `${request.request} request cannot be created, insufficient balance` });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getUserRequests = async (req, res) => {
	try {
		const userRequestData = await getUserRequestData.fetchRequests(req.user.userId);
		if (userRequestData.length == 0) {
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
		const data = await db.sequelize.query('EXEC dbo.spusers_updateuserrequest :userId, :id, :status', {
			replacements: {
				userId: request.userId,
				id: request.requestId,
				status: request.status === 'Approve' ? 'Approved' : 'Rejected'
			}
		});
		if (data[1] != 0) {
			return res.status(201).json({ message: 'Request updated successfully' });
		} else {
			return res.status(400).json({ message: 'Request updation failed' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.updateUserRequest = async (req, res) => {
	try {
		const request = req.body;
		const userRequestData = await db.sequelize.query('EXEC dbo.spusers_updateuserrequest :userId, :id, :status', {
			replacements: {
				userId: req.user.userId,
				id: request.requestId,
				status: 'Cancelled'
			}
		});
		if (userRequestData[1] != 0) {
			return res.status(201).json({ message: 'Request updated successfully' });
		} else {
			return res.status(400).json({ message: 'Request updation failed' });
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
			const deleteData = await db.sequelize.query('EXEC dbo.spusers_deleteuserrequest :userId, :id', {
				replacements: {
					userId: request.userId,
					id: request.requestId
				}
			});
			const resendRequestData = await db.sequelize.query('EXEC dbo.spusers_postuserrequest :userId, :email, :startDate, :endDate, :leaveType, :request, :reason', {
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
			return res.status(201).json({ message: 'User request recreated successfully' });
		} else {
			return res.status(200).json({ message: 'Please create a new request' });
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
