const db = require("../../models");
const User = db.user;
const UserAttendance = db.userAttendance;

const fetchAttendance = async (userEmail) => {
  try {
    const currentUserEmail = userEmail;
    const currentUser = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });

    const data = await User.findAll({
      include: [
        {
          model: UserAttendance,
          as: "userAttendance",
        },
      ],
      where: { id: currentUser[0].dataValues.id },
    });
    return data[0].dataValues.userAttendance;
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No data available" });
  }
};

module.exports = { fetchAttendance };
