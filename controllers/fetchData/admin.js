const db = require('../../models');

const currentAdmin = async (adminEmail) => {
	try {
		const currentAdminData = await db.sequelize.query('EXEC dbo.sp_admins_getcurrentadmin :email', {
			replacements: { email: adminEmail }
		});
		if (currentAdminData[1] === 0) {
			return false;
		} else {
			return currentAdminData[0][0];
		}
	} catch (error) {
		console.log(error);
		return error;
	}
};

const getAdmin = async (adminId) => {
	try {
		const adminData = await db.sequelize.query('EXEC dbo.sp_admins_getadmin :adminId', {
			replacements: { adminId: adminId }
		});
		return adminData[0][0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { currentAdmin, getAdmin };
