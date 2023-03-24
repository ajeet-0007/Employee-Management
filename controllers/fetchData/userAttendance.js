const db = require("../../models");
const currentUser = require("./currentUser");

const fetchAttendance = async (userEmail) => {
  try {
    const userId = await currentUser(userEmail);
    const data = await db.sequelize.query(
      "EXEC dbo.spusers_getuserattendance :userId",
      {
        replacements: { userId: userId },
      }
    );
    return data[0][0];
  } catch (error) {
    return error;
  }
};

module.exports = { fetchAttendance };