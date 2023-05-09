const db = require('../../models');

const fetchSuperiorProfile = async (hrmid) => {
	try {
		const userSuperiorProfileData = await db.sequelize.query('EXEC dbo.spusers_getusersuperiorprofile :hrmid', {
			replacements: { hrmid: hrmid }
		});
		return userSuperiorProfileData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

const fetchSubordinateProfile = async (hrmid) => {
	try {
		const userSubordinateData = await db.sequelize.query('EXEC dbo.spusers_getusersubordinates :hrmid', {
			replacements: { hrmid: hrmid }
		});
		return userSubordinateData[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { fetchSuperiorProfile, fetchSubordinateProfile };
