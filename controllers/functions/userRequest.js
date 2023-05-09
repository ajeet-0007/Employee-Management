const getUserRequestData = require('../fetchData/userRequest');

const getAvailableRequests = async (userId) => {
	let bereavementLeave = 5;
	let casualLeave = new Date().getMonth() + 1;
	let compensatoryOff = 5;
	let leaveWithoutPay = 15;
	let restrictedHoliday = 5;
	let workFromHome = 5;
	const userAddedRequestData = await getUserRequestData.fetchAddedRequests(userId);
	for (let i = 0; i < userAddedRequestData.length; i++) {
		if (userAddedRequestData[i].request === 'Bereavement Leave') {
			if (userAddedRequestData[i].leaveType === 'Full Day') {
				bereavementLeave -= 1;
			} else {
				bereavementLeave -= 0.5;
			}
		} else if (userAddedRequestData[i].request === 'Casual Leave') {
			if (userAddedRequestData[i].leaveType === 'Full Day') {
				casualLeave -= 1;
			} else {
				casualLeave -= 0.5;
			}
		} else if (userAddedRequestData[i].request === 'Compensatory Off') {
			if (userAddedRequestData[i].leaveType === 'Full Day') {
				compensatoryOff -= 1;
			} else {
				compensatoryOff -= 0.5;
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
		bereavementLeave: bereavementLeave,
		casualLeave: casualLeave,
		compensatoryOff: compensatoryOff,
		leaveWithoutPay: leaveWithoutPay,
		restrictedHoliday: restrictedHoliday,
		workFromHome: workFromHome
	};

	return availableRequests;
};

module.exports = { getAvailableRequests };
