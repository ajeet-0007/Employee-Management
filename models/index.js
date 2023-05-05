require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
	host: DB_HOST,
	dialect: 'mssql',
	port: DB_PORT,
	logging: false,
	define: {
		timestamps: false
	}
});

try {
	sequelize
		.authenticate()
		.then(() => {
			console.log('Database connection has been established successfully.');
		})
		.catch((error) => {
			console.error('Unable to connect to the database:', error);
		});
} catch (error) {
	console.log(error);
}

db = {};
db.userTimesheet = require('./timesheet')(sequelize, DataTypes);
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
