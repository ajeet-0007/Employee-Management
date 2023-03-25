const db = require("../../models");
const User = db.user;
const UserAttendance = db.userAttendance;
const getUserAttendanceData = require("../fetchData/userAttendance");
const currentUser = require("../fetchData/currentUser");

exports.postCheckIn = async (req, res) => {
  try {
    const response = req.body;
    const currentUserEmail = req.user.userEmail;
    const userId = await currentUser(currentUserEmail);
    const data = await db.sequelize.query(
      "EXEC dbo.spusers_postcheckin :userId, :checkInTime, :checkInDate, :location",
      {
        replacements: {
          userId: userId,
          checkInTime: response.checkInTime,
          checkInDate: response.checkInDate,
          location: response.location,
        },
      }
    );
    return res.status(201).json({ message: "User checked-in successfully" });
  } catch (error) {
    return res.status(201).json({ message: "User check-in failed" });
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
      return res.status(200).json({ data: userAttendanceData });
    }
  } catch (error) {
    return res.status(404).json({ message: "No data available" });
  }
};

exports.putCheckOut = async (req, res) => {
  try {
    const response = req.body;
    const currentUserEmail = req.user.userEmail;
    const userId = await currentUser(currentUserEmail);
    const data = await db.sequelize.query(
      "EXEC dbo.spusers_updateuserattendance :userId, :checkOutDate, :checkOutTime",
      {
        replacements: {
          userId: userId,
          checkOutDate: response.checkOutDate,
          checkOutTime: response.checkOutTime,
        },
      }
    );
    return res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    return res.status(404).json({ message: "No data updated" });
  }
};
