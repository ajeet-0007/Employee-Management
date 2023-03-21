const bcrypt = require("bcrypt");
const db = require("../../models");
const User = db.user;

exports.postSignUp = async (req, res) => {
  try {
    let response = req.body;
    response.password = await bcrypt.hash(response.password, 10);
    const employeeData = await User.findAll({
      where: {
        hrmid: response.hrmid,
      },
    });
    if (employeeData.length) {
      return res.json({ message: "User already exist" });
    } else {
      const data = await User.create(response);
      res.status(201).json({
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getUser = async (req, res) => {
  try {
    const currentUserEmail = req.user.userEmail;
    const currentUserData = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });
    res.status(200).json({
      data: currentUserData,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No data available" });
  }
};

