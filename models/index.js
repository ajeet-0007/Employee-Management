require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("organizationdb", "root", "12345", {
  host: "localhost",
  dialect: "mssql",
  port: "1433",
  logging: false,
});

try {
  sequelize.authenticate();
} catch (e) {
  console.log(e);
}

db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user")(sequelize, DataTypes);
db.userProfile = require("./userProfile")(sequelize, DataTypes);
db.userSkills = require("./userSkills")(sequelize, DataTypes);
db.userRequest = require("./userRequest")(sequelize, DataTypes);
db.userAttendance = require("./userAttendance")(sequelize, DataTypes);
db.userTimesheet = require("./userTimesheet")(sequelize, DataTypes);
db.userProjectList = require("./userProjectList")(sequelize, DataTypes);

db.sequelize.sync({ force: false });

module.exports = db;
