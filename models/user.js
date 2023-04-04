module.exports = (sequelize, DataTypes) => {
	const USER = sequelize.define('users', {
		hrmid: {
			type: DataTypes.STRING,
		},
		name: {
			type: DataTypes.STRING,
		},
		email: {
			type: DataTypes.STRING,
		},
		password: {
			type: DataTypes.STRING,
		},
		phone: {
			type: DataTypes.STRING,
		},
		role: {
			type: DataTypes.STRING,
		},
		reportingManager: {
			type: DataTypes.STRING,
		},
		location: {
			type: DataTypes.STRING,
		},
		joiningDate: {
			type: DataTypes.DATEONLY,
		},
	});
	return USER;
};
