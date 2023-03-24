const bcrypt = require("bcrypt");
const db = require("../../models");
const currentUser = require("../fetchData/currentUser");
const User = db.user;

exports.postSignUp = async (req, res) => {
  try {
    let response = req.body;
    response.password = await bcrypt.hash(response.password, 10);
    const userId = await currentUser(response.email);
    const existingData = await db.sequelize.query("EXEC dbo.spusers_getuser :userId", {
      replacements: { userId: userId },
    });
    if (existingData.length) {
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
    const userEmail = req.user.userEmail;
    const userId = await currentUser(userEmail);
    const data = await db.sequelize.query("EXEC dbo.spusers_getuser :userId", {
      replacements: { userId: userId },
    });
    return res.status(200).json(data[0][0]);
  } catch (error) {
    return res.status(400).json({
      message: "No data available"
    });
  }
};