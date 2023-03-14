const db = require("../models");
const User = db.user;
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
      console.log(response.password, data[0].dataValues.password);
      const userCheck = await bcrypt.compare(
        response.password,
        data[0].dataValues.password
      );
      console.log(userCheck);
      if (userCheck) {
        res.status(200).json(data);
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
