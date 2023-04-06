module.exports = (sequelize, DataTypes) => {
	const USERATTENDANCE = sequelize.define('userAttendance', {
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
		checkInLocation: {
			type: DataTypes.STRING,
		},
		checkOutLocation: {
			type: DataTypes.STRING,
		},
	});
	return USERATTENDANCE;
};
