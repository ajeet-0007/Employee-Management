const jwt = require("jsonwebtoken");

const authorize = async (req, res, next) => {
  try {
    if (req.cookies) {
      const bearerHeader = req.cookies.employeeManagementCookie.currentUserToken;
      jwt.verify(bearerHeader, "secret-key", (error, decoded) => {
        if (error) {
          console.log(error);
        } else {
          req.user = decoded;
        }
      });
      next();
    } else {
      res.json("Invalid");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = authorize;
