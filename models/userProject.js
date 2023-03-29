module.exports = (sequelize, DataTypes) => {
    const USERPROJECTLIST = sequelize.define("userProjects", {
        userId: {
            type: DataTypes.INTEGER,
        },
        projectId: {
            type: DataTypes.INTEGER,
        },
        projectName: {
            type: DataTypes.STRING,
        },
        assignedOn: {
            type: DataTypes.DATEONLY,
        },
        completeBy: {
            type: DataTypes.DATEONLY,
        },
        teamMembers: {
            type: DataTypes.STRING,
        },
        teamHead: {
            type: DataTypes.STRING,
        },
        department: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "Active",
        },
    });
    return USERPROJECTLIST;
};
