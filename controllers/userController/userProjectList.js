const db = require("../../models");
const User = db.user;
const UserProjectList = db.userProjectList;
const getUserProjectListData = require("../fetchData/userProjectList");

exports.getUserProjectList = async (req, res) => {
  try {
    const currentUserEmail = req.user.userEmail;
    const userProjectListData = await getUserProjectListData.fetchProjectList(
      currentUserEmail
    );
    if (userProjectListData == null) {
      return res.status(404).json({ message: "no data found" });
    } else {
      return res.status(200).json({ data: userProjectListData.dataValues });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No data available" });
  }
};
