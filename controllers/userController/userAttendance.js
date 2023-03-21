const db = require("../../models");
const User = db.user;
const UserAttendance = db.userAttendance;
const getUserAttendanceData = require("../fetchData/userAttendance");

exports.postCheckIn = async (req, res) => {
  try {
    const response = req.body;
    const currentUserEmail = req.user.userEmail;
    const currentUser = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });
    response.userId = currentUser[0].dataValues.id;
    const userAttendance = await UserAttendance.create(response);
    return res.status(201).json(userAttendance);
  } catch (error) {
    console.log(error);
  }
};

exports.getUserAttendance = async (req, res) => {
  try {
    const currentUserEmail = req.user.userEmail;
    const userAttendanceData = await getUserAttendanceData.fetchAttendance(
      currentUserEmail
    );
    if (userAttendanceData == null) {
      return res.status(404).json({ message: "no data found" });
    } else {
      return res.status(200).json({ data: userAttendanceData.dataValues });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No data available" });
  }
};

exports.putCheckOut = async (req, res) => {
  try {
    const response = req.body;
    const currentUserEmail = req.user.userEmail;
    const currentUser = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });
    let currentDate = new Date().toJSON().slice(0, 10);
    const result = await UserAttendance.update(
      {
        checkOutTime: req.body.checkOutTime,
        checkOutDate: req.body.checkOutDate,
      },
      {
        where: {
          checkInDate: currentDate,
          userId: currentUser[0].dataValues.id,
        },
      }
    );
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
