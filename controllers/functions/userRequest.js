const db = require('../../models');
const { getUser } = require('../fetchData/user');
const { randomBytes } = require('crypto');
const getUserRequestData = require('../fetchData/userRequest');

const getAvailableRequests = async (userId) => {
	let casualLeave = new Date().getMonth() + 1;
	let leaveWithoutPay = 15;
	let restrictedHoliday = 5;
	let workFromHome = 5;
	const userAddedRequestData = await getUserRequestData.fetchAddedRequests(userId);
	for (let i = 0; i < userAddedRequestData.length; i++) {
		if (userAddedRequestData[i].request === 'Casual Leave') {
			if (userAddedRequestData[i].leaveType === 'Full Day') {
				casualLeave -= 1;
			} else {
				casualLeave -= 0.5;
			}
		} else if (userAddedRequestData[i].request === 'Leave Without Pay') {
			if (userAddedRequestData[i].leaveType === 'Full Day') {
				leaveWithoutPay -= 1;
			} else {
				leaveWithoutPay -= 0.5;
			}
		} else if (userAddedRequestData[i].request === 'Restricted Holiday') {
			if (userAddedRequestData[i].leaveType === 'Full Day') {
				restrictedHoliday -= 1;
			} else {
				restrictedHoliday -= 0.5;
			}
		} else if (userAddedRequestData[i].request === 'Work From Home') {
			if (userAddedRequestData[i].leaveType === 'Full Day') {
				workFromHome -= 1;
			} else {
				workFromHome -= 0.5;
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
	await db.sequelize.query('EXEC dbo.spusers_postusernotification :notification_id, :content, :sender, :receiver, :type', {
		replacements: {
			notification_id: randomBytes(16).toString('hex'),
			content: `A request is waiting for your approval from ${userData.name}.`,
			sender: userData.hrmid,
			receiver: userData.reportsTo,
			type: 'request'
		}
	});
};

const updateSubordinateRequestNotification = async (senderId, receiverId, status) => {
	const sender = await getUser(senderId); //user who approves the request
	const receiver = await getUser(receiverId); //user who sent the request
	await db.sequelize.query('EXEC dbo.spusers_postusernotification :notification_id, :content, :sender, :receiver, :type', {
		replacements: {
			notification_id: randomBytes(16).toString('hex'),
			content: 'Your request has been ' + status.toLowerCase() + 'ed' + ' by ' + sender.name,
			sender: sender.hrmid,
			receiver: receiver.hrmid,
			type: 'request'
		}
	});
};

const updateRequestNotification = async (userId) => {
	const userData = await getUser(userId);
	await db.sequelize.query('EXEC dbo.spusers_postusernotification :notification_id, :content, :sender, :receiver, :type', {
		replacements: {
			notification_id: randomBytes(16).toString('hex'),
			content: `A request has been cancelled by ${userData.name}.`,
			sender: userData.hrmid,
			receiver: userData.reportsTo,
			type: 'request'
		}
	});
};

module.exports = { getAvailableRequests, createRequestNotification, updateSubordinateRequestNotification, updateRequestNotification };
