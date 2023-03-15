module.exports = (sequelize, DataTypes) => {
  const USER = sequelize.define("USER", {
    hrmid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    reportingManager: {
      type: DataTypes.STRING,
    },
    allocation: {
      type: DataTypes.STRING,
    },
    joiningDate: {
      type: DataTypes.STRING,
    },
  });
  return USER;
};
