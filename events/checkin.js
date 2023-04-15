const authorize = require("./authorize");
const { updateUserTimeDifference, getTimeDifference } = require("./message");
const currentUser = require("../controllers/fetchData/currentUser");
const {
  fetchCurrentAttendance,
} = require("../controllers/fetchData/userAttendance");

const userCheckIn = async (data, socket) => {
  try {
    await authorize(socket, async () => {
      const email = socket.user?.userEmail;
      const userId = await currentUser(email);
      const date = new Date().toISOString().slice(0, 10); // 2021-05-05
      fetchCurrentAttendance(email, date).then(async (data) => {
        const checkInDate = data[0]?.checkInDate;
        const checkinTime = data[0]?.checkInTime;

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
        socket.timer = interval_id;
      });
      
    });
  } catch (error) {
    // console.log(error);
    socket.emit("error", error);
  }
};

module.exports = userCheckIn;
