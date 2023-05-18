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
	const userNotificationData = await fetchNotifications(hrmid);
	const receiver = userNotificationData[0]?.receiver;
	io.to(receiver).emit('notifications', userNotificationData);
};

const sendTo = async (io, hrmid) => {
	const userNotificationData = await fetchNotifications(hrmid);
	io.to(hrmid).emit('notifications', userNotificationData);
};

module.exports = { send, sendTo };
