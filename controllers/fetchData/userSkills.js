const db = require("../../models");
const User = db.user;
const UserSkills = db.userSkills;

const fetchSkills = async (userEmail) => {
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
          model: UserSkills,
          as: "userSkills",
        },
      ],
      where: { id: currentUser[0].dataValues.id },
    });
    return data[0].dataValues.userSkills;
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No data available" });
  }
};

module.exports = { fetchSkills };
