const db = require("../../models");
const User = db.user;
const UserProfile = db.userProfile;
const getUserProfileData = require("../fetchData/userProfile");
const currentUser = require("../fetchData/currentUser");

exports.postUserProfile = async (req, res) => {
  try {
    const response = req.body;
    const currentUserEmail = req.user.userEmail;
    const userId = await currentUser(currentUserEmail);
    response.userId = userId;
    const userDetails = await UserProfile.create(response);
    return res.status(201).json(userDetails);
  } catch (error) {
    return res.status(404).json({ message: "No data available" });
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
      return res.status(200).json({ data: userProfileData });
    }
  } catch (error) {
    return res.status(404).json({ message: "No data available" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const response = req.body;
    const currentUserEmail = req.user.userEmail;
    const userId = await currentUser(currentUserEmail);
    const data = await db.sequelize.query(
      "EXEC dbo.spusers_updateuserprofile :userId, :permanentAddress, :city, :state, :country, :emergencyPhone",
      {
        replacements: {
          userId: userId,
          permanentAddress: response.permanentAddress,
          city: response.city,
          state: response.state,
          country: response.country,
          emergencyPhone: response.emergencyPhone,
        },
      }
    );
    return res.status(200).json({ message: "Data updated successfully"});
  } catch (error) {
    return res.status(404).json({ message: "No data updated" });
  }
};