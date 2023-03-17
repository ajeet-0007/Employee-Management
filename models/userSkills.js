module.exports = (sequelize, DataTypes) => {
  const USERSKILLS = sequelize.define("USERSKILLS", {
    userId: {
      type: DataTypes.INTEGER,
    },
    primarySkills: {
      type: DataTypes.JSON,
    },
    secondarySkills: {
      type: DataTypes.JSON,
    },
    certifications: {
      type: DataTypes.JSON,
    },
  });
  return USERSKILLS;
};
