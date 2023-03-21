const db = require("../../models");

const User = db.user;
const UserProfile = db.userProfile;
const getUserProfileData = require("../fetchData/userProfile");

exports.postUserProfile = async (req, res) => {
  try {
    const response = req.body;
    const currentUserEmail = req.user.userEmail;
    const currentUser = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });
    response.userId = currentUser[0].dataValues.id;
    const userDetails = await UserProfile.create(response);
    return res.status(201).json(userDetails);
  } catch (error) {
    console.log(error);
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const currentUserEmail = req.user.userEmail;
    const userProfileData = await getUserProfileData.fetchProfile(
      currentUserEmail
    );
    if (userProfileData == null) {
      return res.status(404).json({ message: "no data found" });
    } else {
      return res.status(200).json({ data: userProfileData.dataValues });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No data available" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const response = req.body;
    const currentUserEmail = req.user.userEmail;
    const currentUser = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });

    const result = await UserProfile.update(
      {
        permanentAddress: response.permanentAddress,
        city: response.city,
        state: response.state,
        country: response.country,
        emergencyPhone: response.emergencyPhone,
      },
      {
        where: {
          userId: currentUser[0].dataValues.id,
        },
      }
    );
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
