const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("organizationdb", "root", "12345", {
  host: "localhost",
  logging: false,
  dialect: "mysql",
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

db.sequelize.sync({ force: false });

module.exports = db;
