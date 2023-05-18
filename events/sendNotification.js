const { fetchNotifications } = require('../controllers/fetchData/userNotification');

/**
 * @param {
 *  io: socket.io object,
 * } io
 * @param {
 *  socket: socket.io object,
 * } socket
 * @param {
 *  userId: userId of the cuurent user,
 * } userId
 * @param {
 *  rm_id: reportsTo of the current user (RM_ID) or for subordinate sender userId,
 * } rm_id
 * @returns {void}
 */

const send = async (io, userId) => {
	const userNotificationData = await fetchNotifications(userId);
	const receiver = userNotificationData[0]?.receiver;
	io.to(receiver).emit('notifications', userNotificationData);
};

const sendTo = async (io, userId) => {
	const userNotificationData = await fetchNotifications(userId);
	io.to(userId).emit('notifications', userNotificationData);
};

module.exports = { send, sendTo };
