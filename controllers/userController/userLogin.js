const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../models");
const User = db.user;
require('dotenv').config();
const SECRET = process.env.SECRET_KEY;

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

exports.getLogout = (req, res) => {
  res.clearCookie("employeeManagementCookie");
  res.json({ message: "Logged Out Successfully" });
};
