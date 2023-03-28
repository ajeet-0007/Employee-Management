const db = require("../../models");
const currentUser = require("./currentUser");

const fetchRequest = async (userEmail) => {
    try {
        const userId = await currentUser(userEmail);
        const data = await db.sequelize.query(
            "EXEC dbo.spusers_getuserrequests :userId",
            {
                replacements: { userId: userId },
            }
        );
        return data[0][0];
    } catch (error) {
        console.log(error);
        return error;
    }
};

module.exports = { fetchRequest };
