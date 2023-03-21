const db = require("../../models");
const User = db.user;
const UserTimesheet = db.userTimesheet;

const fetchTimesheet = async (userEmail) => {
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
          model: UserTimesheet,
          as: "userTimesheet",
        },
      ],
      where: { id: currentUser[0].dataValues.id },
    });
    return data[0].dataValues.userTimesheet;
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No data available" });
  }
};

module.exports = { fetchTimesheet };
