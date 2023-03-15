module.exports = (sequelize, DataTypes) => {
  const USERATTENDANCE = sequelize.define("USERATTENDANCE", {
    userId: {
      type: DataTypes.INTEGER,
    },
    checkInTime: {
      type: DataTypes.DATE,
    },
    checkOutTime: {
      type: DataTypes.DATE,
    },
  });
  return USERATTENDANCE;
};
