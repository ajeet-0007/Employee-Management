const db = require("../../models");
const User = db.user;
const UserRequest = db.userRequest;

const fetchRequest = async (userEmail) => {
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
          model: UserRequest,
          as: "userRequest",
        },
      ],
      where: { id: currentUser[0].dataValues.id },
    });
    return data[0].dataValues.userRequest;
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No data available" });
  }
};

module.exports = { fetchRequest };
