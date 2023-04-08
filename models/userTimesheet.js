module.exports = (sequelize, DataTypes) => {
	const USERTIMESHEET = sequelize.define('userTimesheets', {
		userId: {
			type: DataTypes.INTEGER,
		},
		timesheetName: {
			type: DataTypes.STRING,
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
		week: {
			type: DataTypes.STRING,
		},
		description: {
			type: DataTypes.STRING,
		},
		startTime: {
			type: DataTypes.STRING,
		},
		endTime: {
			type: DataTypes.STRING,
		},
		billableStatus: {
			type: DataTypes.STRING,
		},
		submittedHours: {
			type: DataTypes.STRING,
		},
		approvedHours: {
			type: DataTypes.STRING,
			defaultValue: '00:00',
		},
	});
	return USERTIMESHEET;
};
