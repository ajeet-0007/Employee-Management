const authorize = require("./authorize");

const userCheckOut = async (data, socket) => {
  await authorize(socket, async () => {

    // console.log(socket);
    // console.log(data);

    // const status_ = data[0]?.status || "not-checked-in";

    socket.emit("status", {
      status: "checked-out",
      timeDifference: "00:00:00",
    });
    
  

    clearInterval(socket.timer);
    clearInterval(socket.timerConnect);
    // disconnect the user
    // socket.disconnect();
  });
};

module.exports = userCheckOut;
