const db = require('../../models');
const { getUser } = require('../fetchData/user');
const { randomBytes } = require('crypto');
const getUserRequestData = require('../fetchData/userRequest');

const calaculateDays = (startDate, endDate) => {
	const date1 = new Date(startDate);
	const date2 = new Date(endDate);
	let timeDiff = Math.abs(date2.getTime() - date1.getTime());
	return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
};

const getAvailableRequests = async (userId) => {
	let casualLeave = new Date().getMonth() + 1;
	let leaveWithoutPay = 15;
	let restrictedHoliday = 5;
	let workFromHome = 5;

	const userAddedRequestData = await getUserRequestData.fetchAddedRequests(userId);
	for (let i = 0; i < userAddedRequestData.length; i++) {
		let days = calaculateDays(userAddedRequestData[i].startDate, userAddedRequestData[i].endDate);
		if (userAddedRequestData[i].request === 'Casual Leave') {
			if (userAddedRequestData[i].leaveType === 'Full Day') {
				casualLeave -= 1 * days;
			} else {
				casualLeave -= 0.5 * days;
			}
		} else if (userAddedRequestData[i].request === 'Leave Without Pay') {
			if (userAddedRequestData[i].leaveType === 'Full Day') {
				leaveWithoutPay -= 1 * days;
			} else {
				leaveWithoutPay -= 0.5 * days;
			}
		} else if (userAddedRequestData[i].request === 'Restricted Holiday') {
			if (userAddedRequestData[i].leaveType === 'Full Day') {
				restrictedHoliday -= 1 * days;
			} else {
				restrictedHoliday -= 0.5 * days;
			}
		} else if (userAddedRequestData[i].request === 'Work From Home') {
			if (userAddedRequestData[i].leaveType === 'Full Day') {
				workFromHome -= 1 * days;
			} else {
				workFromHome -= 0.5 * days;
			}
		}
	}
	const availableRequests = {
		casualLeave: casualLeave,
		leaveWithoutPay: leaveWithoutPay,
		restrictedHoliday: restrictedHoliday,
		workFromHome: workFromHome
	};

	return availableRequests;
};

const createRequestNotification = async (userId) => {
	const userData = await getUser(userId);
	await db.sequelize.query('EXEC dbo.spusers_postusernotification :notification_id, :content, :sender, :receiver, :date, :type', {
		replacements: {
			notification_id: randomBytes(16).toString('hex'),
			content: `A request is waiting for your approval from ${userData.name}.`,
			sender: userData.hrmid,
			receiver: userData.reportsTo,
			date: new Date(),
			type: 'request'
		}
	});
};

const updateSubordinateRequestNotification = async (senderId, receiverId, status) => {
	const sender = await getUser(senderId); //user who approves the request
	const receiver = await getUser(receiverId); //user who sent the request
	await db.sequelize.query('EXEC dbo.spusers_postusernotification :notification_id, :content, :sender, :receiver, :date, :type', {
		replacements: {
			notification_id: randomBytes(16).toString('hex'),
			content: `Your request has been ${status.toLowerCase() === 'approve' ? 'approved' : 'rejected'} by ${sender.name}.`,
			sender: sender.hrmid,
			receiver: receiver.hrmid,
			date: new Date(),
			type: 'request'
		}
	});
};

const updateRequestNotification = async (userId) => {
	const userData = await getUser(userId);
	const date = new Date();
	await db.sequelize.query('EXEC dbo.spusers_postusernotification :notification_id, :content, :sender, :receiver, :date, :type', {
		replacements: {
			notification_id: randomBytes(16).toString('hex'),
			content: `A request has been cancelled by ${userData.name}.`,
			sender: userData.hrmid,
			receiver: userData.reportsTo,
			date: date,
			type: 'request'
		}
	});
};

module.exports = { calaculateDays, getAvailableRequests, createRequestNotification, updateSubordinateRequestNotification, updateRequestNotification };
