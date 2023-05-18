exports.getuser = async (id) => {
	try {
		const data = await db.sequelize.query('EXEC dbo.spusers_getuser :id', {
			replacements: {
				id: id
			}
		});
		return data[0][0];
	} catch (error) {
		console.log(error);
		return null;
	}
};
