const db = require("../../models");

const currentUser = async (userEmail) => {
  try {
    const currentUser = await db.sequelize.query(
      "EXEC dbo.spusers_getcurrentuser :email",
      {
        replacements: { email: userEmail },
      }
    );
    return currentUser[0][0].id;
  } catch (error) {
    return error;
  }
};

module.exports = currentUser;
