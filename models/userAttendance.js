module.exports = (sequelize, DataTypes) => {
  const USERATTENDANCE = sequelize.define("USERATTENDANCE", {
    userId: {
      type: DataTypes.INTEGER,
    },
    checkInTime: {
      type: DataTypes.TIME,
    },
    checkOutTime: {
      type: DataTypes.TIME,
    },
    checkInDate: {
      type: DataTypes.DATEONLY,
    },
    checkOutDate: {
      type: DataTypes.DATEONLY,
    },
  });
  return USERATTENDANCE;
};
