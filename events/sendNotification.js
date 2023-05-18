const { fetchNotifications } = require('../controllers/fetchData/userNotification');

/**
 * @param {
 *  io: socket.io object,
 * } io
 * @param {
 *  socket: socket.io object,
 * } socket
 * @param {
 *  hrmid: hrmid of current user,
 * } hrmid
 * @param {
 *  rmHrmid: reportsTo of the current user for subordinate sender hrmid,
 * } rmHrmid
 * @returns {void}
 */

const send = async (io, hrmid) => {
	let unreadCount = 0;
	const userNotificationData = await fetchNotifications(hrmid);
	const receiver = userNotificationData[0]?.receiver;
	userNotificationData.forEach((data) => {
		if (data.status === 'unread') {
			unreadCount++;
		}
	});
	io.to(receiver).emit('notifications', { unread: unreadCount, messages: userNotificationData });
};

const sendTo = async (io, hrmid) => {
	let unreadCount = 0;
	const userNotificationData = await fetchNotifications(hrmid);
	userNotificationData.forEach((data) => {
		if (data.status === 'unread') {
			unreadCount++;
		}
	});
	io.to(hrmid).emit('notifications', { unread: unreadCount, messages: userNotificationData });
};

module.exports = { send, sendTo };
