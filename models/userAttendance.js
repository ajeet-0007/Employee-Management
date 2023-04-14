module.exports = (sequelize, DataTypes) => {
  const USERATTENDANCE = sequelize.define("userAttendance", {
    userId: {
      type: DataTypes.INTEGER,
    },
    checkInTime: {
      type: DataTypes.STRING,
    },
    checkOutTime: {
      type: DataTypes.STRING,
    },
    checkInDate: {
      type: DataTypes.DATEONLY,
    },
    checkOutDate: {
      type: DataTypes.DATEONLY,
    },
    checkInLocation: {
      type: DataTypes.STRING,
    },
    checkOutLocation: {
      type: DataTypes.STRING,
    },
    timeDifference: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
  });
  return USERATTENDANCE;
};
