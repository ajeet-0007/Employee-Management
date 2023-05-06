const db = require('../../models');
const getUserRequestData = require('../fetchData/userRequest');
const currentUser = require('../fetchData/currentUser');

exports.postUserRequest = async (req, res) => {
	try {
		const request = req.body;
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		const data = await db.sequelize.query('EXEC dbo.spusers_postuserrequest :userId, :email, :startDate, :endDate, :leaveType, :request, :reason', {
			replacements: {
				userId: userId,
				email: request.email,
				startDate: request.startDate,
				endDate: request.endDate,
				leaveType: request.leaveType,
				request: request.request,
				reason: request.reason
			}
		});
		return res.status(201).json({ message: 'User request created successfully' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getUserRequests = async (req, res) => {
	try {
		const currentUserEmail = req.user.userEmail;
		const userRequestData = await getUserRequestData.fetchRequests(currentUserEmail);
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
		const currentUserEmail = req.user.userEmail;
		const subordinateRequestsData = await getUserRequestData.fetchSubordinatesRequests(currentUserEmail);
		if (subordinateRequestsData.length == 0) {
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
		const userId = request.userId;
		const requestId = request.requestId;
		const status = request.status === 'Approve' ? 'Approved' : 'Rejected';
		const data = await db.sequelize.query('EXEC dbo.spusers_updateuserrequest :userId, :id, :status', {
			replacements: {
				userId: userId,
				id: requestId,
				status: status
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
		const currentUserEmail = req.user.userEmail;
		const userId = await currentUser(currentUserEmail);
		const status = 'Cancelled';
		const requestId = request.requestId;
		const userRequestData = await db.sequelize.query('EXEC dbo.spusers_updateuserrequest :userId, :id, :status', {
			replacements: {
				userId: userId,
				id: requestId,
				status: status
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
		const userId = request.userId;
		const requestId = request.requestId;
		const userRequestData = await getUserRequestData.fetchCurrentRequest(userId, requestId);
		if (new Date(userRequestData[0].startDate).getTime() > Date.now()) {
			const deleteData = await db.sequelize.query('EXEC dbo.spusers_deleteuserrequest :userId, :id', {
				replacements: {
					userId: userId,
					id: requestId
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
		const userId = await currentUser(req.user.userEmail);
		let bereavementLeave = 5;
		let casualLeaveIntern = new Date().getMonth() + 1;
		let compensatoryOff = 5;
		let leaveWithoutPay = 15;
		let restrictedHoliday = 5;
		let workFromHome = 5;
		const userApprovedRequestData = await getUserRequestData.fetchApprovedRequests(userId);
		for (let i = 0; i < userApprovedRequestData.length; i++) {
			if (userApprovedRequestData[i].request === 'Bereavement Leave') {
				if (userApprovedRequestData[i].leaveType === 'Full-Day') {
					bereavementLeave -= 1;
				} else {
					bereavementLeave -= 0.5;
				}
			} else if (userApprovedRequestData[i].request === 'Casual Leave Intern') {
				if (userApprovedRequestData[i].leaveType === 'Full-Day') {
					casualLeaveIntern -= 1;
				} else {
					casualLeaveIntern -= 0.5;
				}
			} else if (userApprovedRequestData[i].request === 'Compensatory Off') {
				if (userApprovedRequestData[i].leaveType === 'Full-Day') {
					compensatoryOff -= 1;
				} else {
					compensatoryOff -= 0.5;
				}
			} else if (userApprovedRequestData[i].request === 'Leave Without Pay') {
				if (userApprovedRequestData[i].leaveType === 'Full-Day') {
					leaveWithoutPay -= 1;
				} else {
					leaveWithoutPay -= 0.5;
				}
			} else if (userApprovedRequestData[i].request === 'Restricted Holiday') {
				if (userApprovedRequestData[i].leaveType === 'Full-Day') {
					restrictedHoliday -= 1;
				} else {
					restrictedHoliday -= 0.5;
				}
			} else if (userApprovedRequestData[i].request === 'Work From Home') {
				if (userApprovedRequestData[i].leaveType === 'Full-Day') {
					workFromHome -= 1;
				} else {
					workFromHome -= 0.5;
				}
			}
		}
		const availableRequests = {
			bereavementLeave: bereavementLeave,
			casualLeaveIntern: casualLeaveIntern,
			compensatoryOff: compensatoryOff,
			leaveWithoutPay: leaveWithoutPay,
			restrictedHoliday: restrictedHoliday,
			workFromHome: workFromHome
		};
		return res.status(200).json(availableRequests);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
