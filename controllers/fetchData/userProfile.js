const db = require("../../models");
const User = db.user;
const UserProfile = db.userProfile;

const fetchProfile = async (userEmail) => {
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
          model: UserProfile,
          as: "userProfile",
        },
      ],
      where: { id: currentUser[0].dataValues.id },
    });
    return data[0].dataValues.userProfile;
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No data available" });
  }
};

module.exports = {fetchProfile};