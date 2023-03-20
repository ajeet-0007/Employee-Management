module.exports = (sequelize, DataTypes) => {
    const USERTIMESHEET = sequelize.define("USERTIMESHEET", {
      userId: {
        type: DataTypes.INTEGER,
      },
      clientName: {
        type: DataTypes.STRING,
      },
      projectName: {
        type: DataTypes.STRING,
      },
      jobName: {
        type: DataTypes.STRING,
      },
      workItem: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.DATEONLY,
      },
      description: {
        type: DataTypes.STRING,
      },
      startTime: {
        type: DataTypes.TIME,
      },
      endTime: {
        type: DataTypes.TIME,
      },
      billableStatus: {
        type: DataTypes.ENUM("Billable", "Non-Billable"),
        defaultValue: "Non-Billable",
      },
    });
    return USERTIMESHEET;
  };
  