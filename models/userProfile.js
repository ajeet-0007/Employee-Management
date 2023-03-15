module.exports=(sequelize, DataTypes) => {
    const USERPROFILE = sequelize.define("USERPROFILE", {
        userId :{
            type: DataTypes.INTEGER
        },
        permanentAddress: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        country: {
            type: DataTypes.STRING
        },
        emergencyPhone: {
            type: DataTypes.STRING
        }
    })
    return USERPROFILE;
}