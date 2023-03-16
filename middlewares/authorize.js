const jwt = require("jsonwebtoken");

const authorize = async (req, res, next) => {
  try {
    if (req.cookies) {
      const bearerHeader = req.headers.authorization.split(" ")[1];
      jwt.verify(bearerHeader, "secret-key", (error, decoded) => {
        if (error) {
          console.log(error);
        } else {
          console.log(decoded);
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
