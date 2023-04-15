const userCheckInEvent = require("./checkin");
const userCheckOutEvent = require("./checkout");

const authorize = require("./authorize");
const { updateUserTimeDifference, getTimeDifference } = require("./message");
const currentUser = require("../controllers/fetchData/currentUser");
const {
  fetchCurrentAttendance,
} = require("../controllers/fetchData/userAttendance");

const onConnection = (io) => async (socket) => {
  try {
    await authorize(socket, async () => {
      console.log("Client connected: " + socket.id);
      const email = socket.user?.userEmail;
      const userId = await currentUser(email);
      const date = new Date().toISOString().slice(0, 10); // 2021-05-05
      fetchCurrentAttendance(email, date).then(async (data) => {
        const checkInDate = data[0]?.checkInDate;
        const checkinTime = data[0]?.checkInTime;
        const status = data[0]?.status;

        if (status === "checked-in") {
          // timer for checkin
          const interval_id = setInterval(async () => {
            const checkOutDate = data[0]?.checkOutDate;
            if (checkOutDate) {
              clearInterval(interval_id);
              return;
            }
            const timeDifference = getTimeDifference(checkinTime, date);
            await updateUserTimeDifference(userId, checkInDate, timeDifference);
            const data_ = await fetchCurrentAttendance(email, date);
            socket.in(email).emit("message", data_[0]?.timeDifference);
            socket.in(email).emit("status", data_[0]?.status);
          }, 1000);
          socket.timerConnect = interval_id;
        }
      });
    });
  } catch (error) {
    // console.log(error);
    socket.emit("error", error);
  }
  socket.on("checkin", (data) => userCheckInEvent(data, socket));
  socket.on("checkout", (data) => userCheckOutEvent(data, socket));
  socket.on("disconnect", () => {
    clearInterval(socket?.timer);
    clearInterval(socket?.timerConnect);
    console.log("Client disconnected");
  });
};

module.exports = { onConnection };
