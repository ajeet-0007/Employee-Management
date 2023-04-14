const updateUserTimeDifference = async (userId, checkInDate, timeDifference) => {
	try {
		const data = await db.sequelize.query(
			'EXEC dbo.spusers_updatetimedifference :userId, :checkInDate, :timeDifference',
			{
				replacements: {
					userId: userId,
					checkInDate,
					timeDifference
				}
			}
		);
		return data[0];
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = { updateUserTimeDifference };
