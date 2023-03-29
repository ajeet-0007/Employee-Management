const db = require("../../models");
const getUserRequestData = require("../fetchData/userRequest");
const currentUser = require("../fetchData/currentUser");

exports.postUserRequest = async (req, res) => {
    try {
        const response = req.body;
        const currentUserEmail = req.user.userEmail;
        const userId = await currentUser(currentUserEmail);
        const data = await db.sequelize.query(
            "EXEC dbo.spusers_postuserrequest :userId, :startDate, :endDate, :request",
            {
                replacements: {
                    userId: userId,
                    startDate: response.startDate,
                    endDate: response.endDate,
                    request: response.request,
                },
            }
        );
        return res
            .status(201)
            .json({ message: "User request created successfully" });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "User request creation failed" });
    }
};

exports.getUserRequests = async (req, res) => {
    try {
        const currentUserEmail = req.user.userEmail;
        const userRequestData = await getUserRequestData.fetchRequests(
            currentUserEmail
        );
        if (userRequestData.length == 0) {
            return res.status(404).json({ message: "No user request found" });
        } else {
            return res.status(200).json({ data: userRequestData });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "No data available" });
    }
};
