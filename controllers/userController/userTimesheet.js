const db = require("../../models");
const User = db.user;
const UserTimesheet = db.userTimesheet;
const getUserTimesheetData = require("../fetchData/userTimesheet");

exports.postUserTimesheet = async (req, res) => {
  try {
    const response = req.body;
    const currentUserEmail = req.user.userEmail;
    const currentUser = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });
    response.userId = currentUser[0].dataValues.id;
    const userTimesheet = await UserTimesheet.create(response);
    return res.status(201).json(userTimesheet);
  } catch (error) {
    console.log(error);
  }
};

exports.getUserTimesheet = async (req, res) => {
  try {
    const currentUserEmail = req.user.userEmail;
    const userTimesheetData = await getUserTimesheetData.fetchTimesheet(
      currentUserEmail
    );
    if (userTimesheetData == null) {
      return res.status(404).json({ message: "no data found" });
    } else {
      return res.status(200).json({ data: userTimesheetData.dataValues });
    }
  } catch (error) {
    console.log(error);
  }
};
