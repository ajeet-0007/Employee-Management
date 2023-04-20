module.exports = (sequelize, DataTypes) => {
	const USERREQUEST = sequelize.define('userRequests', {
		userId: {
			type: DataTypes.INTEGER
		},
		email: {
			type: DataTypes.STRING
		},
		startDate: {
			type: DataTypes.DATEONLY
		},
		endDate: {
			type: DataTypes.DATEONLY
		},
		leaveType: {
			type: DataTypes.STRING
		},
		request: {
			type: DataTypes.STRING
		},
		reason: {
			type: DataTypes.STRING
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: 'Pending'
		}
	});
	return USERREQUEST;
};
