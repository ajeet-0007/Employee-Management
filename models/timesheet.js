// module.exports = (sequelize, DataTypes) => {
// 	const USERTIMESHEET = sequelize.define('userTimesheets', {
// 		userId: {
// 			type: DataTypes.INTEGER
// 		},
// 		timesheetName: {
// 			type: DataTypes.STRING
// 		},
// 		clientName: {
// 			type: DataTypes.STRING
// 		},
// 		projectName: {
// 			type: DataTypes.STRING
// 		},
// 		jobName: {
// 			type: DataTypes.STRING
// 		},
// 		workItem: {
// 			type: DataTypes.STRING
// 		},
// 		description: {
// 			type: DataTypes.STRING
// 		},
// 		date: {
// 			type: DataTypes.DATEONLY
// 		},
// 		week: {
// 			type: DataTypes.STRING
// 		},
// 		totalTime: {
// 			type: DataTypes.TIME
// 		},
// 		billableStatus: {
// 			type: DataTypes.STRING
// 		},
// 		submittedHours: {
// 			type: DataTypes.STRING
// 		},
// 		approvedHours: {
// 			type: DataTypes.STRING,
// 			defaultValue: 'Waiting for Approval'
// 		},
// 		status: {
// 			type: DataTypes.STRING,
// 			defaultValue: 'Pending'
// 		}
// 	});
// 	return USERTIMESHEET;
// };
