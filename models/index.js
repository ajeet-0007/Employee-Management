require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "mssql",
    port: DB_PORT,
    logging: false,
    define: {
        timestamps: false,
    },
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
db.userProject = require("./userProject")(sequelize, DataTypes);

db.sequelize.sync({ force: false });

module.exports = db;
