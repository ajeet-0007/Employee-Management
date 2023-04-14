const authorize = require("./authorize");

const userCheckOut = async (data, socket) => {
  await authorize(socket, async () => {
    socket.emit("message", "00:00:00");
    clearInterval(socket.timer);
    clearInterval(socket.timerConnect);
    // disconnect the user
    socket.disconnect();
  });
};

module.exports = userCheckOut;
