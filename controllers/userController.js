const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const UserProfile = db.userProfile;
const UserSkills = db.userSkills;
const UserRequest = db.userRequest;
const UserAttendance = db.userAttendance;
const bcrypt = require("bcrypt");
const { userRequest } = require("../models");
const SECRET = "secret-key";


exports.postLogin = async (req, res) => {
  try {
    // res.clearCookie();
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
        const userEmail = data[0].dataValues.email;
        const userId = data[0].dataValues.id;
        jwt.sign({ userEmail }, SECRET, (error, token) => {
          if (error) {
            console.log(error);
          } else {
            const userToken = {
              currentUserId: userId,
              currentUserToken: token,
            };
            res.cookie("employeeManagementCookie", userToken);
            res.status(200).json({
              data: data,
              cookie: req.cookies,
            });
          }
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
  res.clearCookie("employeeManagementCookie");
  res.json({ message: "Logged Out Successfully" });
};

exports.postUserProfileDetails = async (req, res) => {
  try {
    const response = req.body;
    const userId = req.cookies["employeeManagementCookie"].currentUserId;
    const currentUser = await User.findAll({
      where: {
        id: userId,
      },
    });
    response.userId = currentUser[0].dataValues.id;
    const userDetails = await UserProfile.create(response);
    return res.status(200).json(userDetails);
  } catch (error) {
    console.log(error);
  }
};

exports.postUserAddSkills = async (req, res) => {
  try {
    const response = req.body;
    const userId = req.cookies["employeeManagementCookie"].currentUserId;
    const currentUser = await User.findAll({
      where: {
        id: userId,
      },
    });
    response.userId = currentUser[0].dataValues.id;
    const userSkills = await UserSkills.create(response);
    return res.status(200).json(userSkills);
  } catch (error) {
    console.log(error);
  }
};

exports.postUserRequest = async (req, res) => {
  try {
    const response = req.body;
    const userId = req.cookies["employeeManagementCookie"].currentUserId;
    const currentUser = await User.findAll({
      where: {
        id: userId,
      },
    });
    response.userId = currentUser[0].dataValues.id;
    addUserId(req, response);
    const userRequest = await UserRequest.create(response);
    return res.status(200).json(userRequest);
  } catch (error) {
    console.log(error);
  }
};

exports.farzi = async (req, res) => {
  const userId = req.cookies["employeeManagementCookie"].currentUserId;
  const currentUser = await User.findAll({
    where: {
      id: userId,
    },
  });
  const data = await User.findAll({
    include: [
      {
        model: userRequest,
        as: "userRequest",
      },
    ],
    where: { id: currentUser[0].dataValues.id },
  });
  console.log(data[0].dataValues.userRequest);
};

exports.postCheckIn = async (req, res) => {
  try {
    const response = req.body;
    const userId = req.cookies["employeeManagementCookie"].currentUserId;
    const currentUser = await User.findAll({
      where: {
        id: userId,
      },
    });
    response.userId = currentUser[0].dataValues.id;
    const userAttendance = await UserAttendance.create(response);
    return res.status(200).json(userAttendance);
  } catch (error) {
    console.log(error);
  }
};

exports.postCheckOut = async (req, res) => {
  try {
    const response = req.body;
    const userId = req.cookies["employeeManagementCookie"].currentUserId;
    const currentUser = await User.findAll({
      where: {
        id: userId,
      },
    });
    let currentDate = new Date().toJSON().slice(0, 10);
    console.log(currentUser[0].dataValues.id);
    const result = await UserAttendance.update(
      { checkOutTime: req.body.checkOutTime, checkOutDate: req.body.checkOutDate },
      { where: { checkInDate: currentDate} }
    );
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
