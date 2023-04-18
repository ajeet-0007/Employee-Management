const updateUserTimeDifference = async (
  userId,
  checkInDate,
  checInTime,
  timeDifference
) => {
  try {
    const data = await db.sequelize.query(
      "EXEC dbo.spusers_updatetimedifference :userId, :checkInDate, :checkInTime, :timeDifference",
      {
        replacements: {
          userId: parseInt(userId),
          checkInDate,
          checInTime,
          timeDifference,
        },
      }
    );
    return data[0];
  } catch (error) {
    // console.log(error);
    return error;
  }
};

const getTimeDifference = (time, date) => {
  const date1 = new Date(`${date} ${time}`);

  const date2 = new Date();

  let diff = Math.abs((date2.getTime() - date1.getTime()) / 1000);

  let seconds = Math.floor(diff) % 60;

  if (seconds < 10 || seconds == 0) {
    seconds = "0" + seconds;
  }

  diff /= 60;

  let minutes = Math.floor(diff) % 60;

  if (minutes < 10 || minutes == 0) {
    minutes = "0" + minutes;
  }

  diff /= 60;

  let hours = Math.floor(diff) % 24;

  if (hours < 10 || hours == 0) {
    hours = "0" + hours;
  }

  return hours + ":" + minutes + ":" + seconds;
};

module.exports = {
  updateUserTimeDifference,
  getTimeDifference,
};
