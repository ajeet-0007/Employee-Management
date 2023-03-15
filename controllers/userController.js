const db = require("../models");
const User = db.user;
const UserProfile = db.userProfile;
const UserSkills = db.userSkills;
const UserRequest = db.userRequest;
const UserAttendance = db.userAttendance;
const bcrypt = require("bcrypt");

exports.postLogin = async (req, res) => {
  try {
    const response = {
      email: req.body.email,
      password: req.body.password,
    };
    const data = await User.findAll({
      where: {
        email: response.email,
      },
    });
    if (data[0].dataValues.email) {
      const userCheck = await bcrypt.compare(
        response.password,
        data[0].dataValues.password
      );
      if (userCheck) {
        const encryptedData = await bcrypt.hash(data[0].dataValues.email, 10);
        res.cookie("cookieEncryptedData", encryptedData);

        res.status(200).json({
          data: data,
          cookie: req.cookies,
        });
      } else {
        res.json({ message: "Invalid Password" });
      }
    } else {
      res.status(403).json({
        message: "user doesn't exist",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

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
      res.status(200).json({
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getLogout = (req, res) => {
  res.clearCookie();
  res.json({ message: "Log-Out Successful" });
};

exports.postUserProfileDetails = async (req, res) => {
  try {
    const response = req.body;
    const userDetails = await UserProfile.create(response);
    return res.status(200).json(userDetails);
  } catch (error) {
    console.log(error);
  }
};

exports.postUserAddSkills = async (req, res) => {
  try {
    const response = req.body;
    const userSkills = await UserSkills.create(response);
    return res.status(200).json(userSkills);
  } catch (error) {
    console.log(error);
  }
};

exports.postUserRequest = async (req, res) => {
  try {
    const response = req.body;
    const userRequest = await UserRequest.create(response);
    return res.status(200).json(userRequest);
  } catch (error) {
    console.log(error);
  }
};

exports.postCheckIn = async (req, res) => {
  try {
    const response = req.body;
    const userAttendance = await UserAttendance.create(response);
    return res.status(200).json(userAttendance);
  } catch (error) {
    console.log(error);
  }
};

exports.postCheckOut = async (req, res) => {
  try {
    const response = req.body;
    const userAttendance = await UserAttendance.create(response);
    return res.status(200).json(userAttendance);
  } catch (error) {
    console.log(error);
  }
};
