const jwt = require("jsonwebtoken");
const db = require("../models");
const bcrypt = require("bcrypt");
const User = db.user;
const UserProfile = db.userProfile;
const UserSkills = db.userSkills;
const UserRequest = db.userRequest;
const UserAttendance = db.userAttendance;
const UserTimesheet = db.userTimesheet;
const SECRET = "secret-key";

//Post-Apis

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
      res.status(201).json({
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

exports.postUserAddSkills = async (req, res) => {
  try {
    const response = req.body;
    const currentUserEmail = req.user.userEmail;
    const currentUser = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });
    response.userId = currentUser[0].dataValues.id;
    const userSkills = await UserSkills.create(response);
    return res.status(201).json(userSkills);
  } catch (error) {
    console.log(error);
  }
};

exports.postUserRequest = async (req, res) => {
  try {
    const response = req.body;
    const currentUserEmail = req.user.userEmail;
    const currentUser = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });
    response.userId = currentUser[0].dataValues.id;
    // addUserId(req, response);
    const userRequest = await UserRequest.create(response);
    return res.status(201).json(userRequest);
  } catch (error) {
    console.log(error);
  }
};

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

//Get APis

exports.getUserProfile = async (req, res) => {
  try {
    const currentUserEmail = req.user.userEmail;
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
    res.status(200).json({
      data: data[0].dataValues.userProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No data available" });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const currentUserEmail = req.user.userEmail;
    const currentUser = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });

    const data = await User.findAll({
      include: [
        {
          model: UserRequest,
          as: "userRequest",
        },
      ],
      where: { id: currentUser[0].dataValues.id },
    });
    res.status(200).json({
      data: data[0].dataValues.userRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No data available" });
  }
};

exports.getUserSkills = async (req, res) => {
  try {
    const currentUserEmail = req.user.userEmail;
    const currentUser = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });

    const data = await User.findAll({
      include: [
        {
          model: UserSkills,
          as: "userSkills",
        },
      ],
      where: { id: currentUser[0].dataValues.id },
    });
    res.status(200).json({
      data: data[0].dataValues.userSkills,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No data available" });
  }
};

exports.getUserAttendance = async (req, res) => {
  try {
    const currentUserEmail = req.user.userEmail;
    const currentUser = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });

    const data = await User.findAll({
      include: [
        {
          model: UserAttendance,
          as: "userAttendance",
        },
      ],
      where: { id: currentUser[0].dataValues.id },
    });
    res.status(200).json({
      data: data[0].dataValues.userAttendance,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No data available" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const currentUserEmail = req.user.userEmail;
    const currentUser = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });
    res.status(200).json({
      data: currentUser,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No data available" });
  }
};

exports.getUserTimesheet = async (req, res) => {
  try {
    const currentUserEmail = req.user.userEmail;
    const currentUser = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });
    const data = await User.findAll({
      include: [
        {
          model: UserTimesheet,
          as: "userTimesheet",
        },
      ],
      where: { id: currentUser[0].dataValues.id },
    });
    res.status(200).json({
      data: data[0].dataValues.userTimesheet,
    });
  } catch (error) {
    console.log(error);
  }
};

//put Apis

exports.postCheckOut = async (req, res) => {
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

exports.updateUserSkills = async (req, res) => {
  try {
    const response = req.body;
    const currentUserEmail = req.user.userEmail;
    const currentUser = await User.findAll({
      where: {
        email: currentUserEmail,
      },
    });

    const result = await UserSkills.update(
      {
        primarySkills: response.primarySkills,
        secondarySkills: response.secondarySkills,
        certifications: response.certifications,
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
