const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET_KEY;

const authorize = async (req, res, next) => {
  try {
    if (Object.keys(req.cookies).length != 0) {
      const bearerHeader =
        req.cookies.employeeManagementCookie.currentUserToken;
      jwt.verify(bearerHeader, SECRET, (error, decoded) => {
        if (error) {
          res.status(403).json({
            message: "Access Denied",
          });
        } else {
          req.user = decoded;
        }
      });
      next();
    } else {
      res.status(403).json({
        message: "Access Denied",
      });
    }
  } catch (error) {
    console.log(error);
    res.json();
  }
};

module.exports = authorize;
