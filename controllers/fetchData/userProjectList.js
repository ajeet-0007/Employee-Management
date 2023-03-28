const db = require("../../models");
const User = db.user;
const UserProjectList = db.userProjectList;

const fetchProjectList = async (userEmail) => {
    const errorData = { message: "no project list found" };
    try {
        const currentUserEmail = userEmail;
        const currentUser = await User.findAll({
            where: {
                email: currentUserEmail,
            },
        });
        try {
            const data = await User.findAll({
                include: [
                    {
                        model: UserProjectList,
                        as: "userProjectList",
                    },
                ],
                where: { id: currentUser[0].dataValues.id },
            });

            return data[0].dataValues.userProjectList;
        } catch (error) {
            return errorData;
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "No data available" });
    }
};

module.exports = { fetchProjectList };
