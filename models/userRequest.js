module.exports = (sequelize, DataTypes) => {
  const USERREQUEST = sequelize.define("userRequest", {
    userId: {
      type: DataTypes.INTEGER,
    },
    startDate: {
      type: DataTypes.DATEONLY,
    },
    endDate: {
      type: DataTypes.DATEONLY,
    },
    request: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Pending",
    },
  });
  return USERREQUEST;
};
