module.exports = (sequelize, DataTypes) => {
  const USERREQUEST = sequelize.define("USERREQUEST", {
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
    }
  });
  return USERREQUEST;
};
