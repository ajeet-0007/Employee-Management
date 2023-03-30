module.exports = (sequelize, DataTypes) => {
    const USERSKILLS = sequelize.define("userSkills", {
        userId: {
            type: DataTypes.INTEGER,
        },
        primarySkills: {
            type: DataTypes.STRING,
        },
        secondarySkills: {
            type: DataTypes.STRING,
        },
        certifications: {
            type: DataTypes.STRING,
        },
    });
    return USERSKILLS;
};
