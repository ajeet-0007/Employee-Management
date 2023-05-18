const { fetchNotifications } = require('../controllers/fetchData/userNotification');

/**
 *
 * @param {
 *  io: socket.io object,
 * } io
 * @param {
 *  socket: socket.io object,
 * } socket
 * @param {
 *  id: userId of the cuurent user,
 * } id
 * @param {
 *  rm_id: reportsTo of the current user (RM_ID) or for subordinate sender id,
 * } rm_id
 * @returns {void}
 */
const send = async (io, id) => {
	const userNotificationData = await fetchNotifications(id);
	const receiver = userNotificationData[0]?.receiver;
	io.to(receiver).emit('notifications', userNotificationData);
};

const sendTo = async (io, id) => {
	const userNotificationData = await fetchNotifications(id);
	io.to(id).emit('notifications', userNotificationData);
};

module.exports = { send, sendTo };
