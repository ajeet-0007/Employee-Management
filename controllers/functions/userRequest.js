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

module.exports = { getAvailableRequests };
