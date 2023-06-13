module.exports = (sequelize, DataTypes) => {
	const USERTIMESHEET = sequelize.define('timesheets', {
		user_id: {
			type: DataTypes.INTEGER
		},
		timesheet_id: {
			type: DataTypes.STRING
		},
		timesheet_name: {
			type: DataTypes.STRING
		},
		client_name: {
			type: DataTypes.STRING
		},
		project_name: {
			type: DataTypes.STRING
		},
		job_name: {
			type: DataTypes.STRING
		},
		work_item: {
			type: DataTypes.STRING
		},
		description: {
			type: DataTypes.STRING
		},
		date: {
			type: DataTypes.DATEONLY
		},
		week: {
			type: DataTypes.STRING
		},
		total_time: {
			type: DataTypes.TIME
		},
		billable_status: {
			type: DataTypes.STRING
		},
		submitted_hours: {
			type: DataTypes.STRING
		},
		approved_hours: {
			type: DataTypes.STRING,
			defaultValue: '00:00'
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: 'Pending'
		}
	});
	return USERTIMESHEET;
};
