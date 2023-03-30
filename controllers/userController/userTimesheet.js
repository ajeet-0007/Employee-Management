const db = require("../../models");
const getUserTimesheetData = require("../fetchData/userTimesheet");
const currentUser = require("../fetchData/currentUser");

exports.postUserTimesheet = async (req, res) => {
    try {
        const response = req.body;
        const currentUserEmail = req.user.userEmail;
        const userId = await currentUser(currentUserEmail);
        const data = await db.sequelize.query(
            "EXEC dbo.spusers_postusertimesheet :userId, :clientName, :projectName, :jobName, :workItem, :date, :description, :startTime, :endTime, :billableStatus",
            {
                replacements: {
                    userId: userId,
                    clientName: response.clientName,
                    projectName: response.projectName,
                    jobName: response.jobName,
                    workItem: response.workItem,
                    date: response.date,
                    description: response.description,
                    startTime: response.startTime,
                    endTime: response.endTime,
                    billableStatus: response.billableStatus,
                },
            }
        );
        return res
            .status(201)
            .json({ message: "User timesheet created successfully" });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "User timesheet creation failed" });
    }
};

exports.getUserTimesheets = async (req, res) => {
    try {
        const currentUserEmail = req.user.userEmail;
        const userTimesheetData = await getUserTimesheetData.fetchTimesheets(
            currentUserEmail
        );
        if (userTimesheetData.length == 0) {
            return res.status(404).json({ message: "No user timesheets found" });
        } else {
            return res.status(200).json({ data: userTimesheetData });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "No data available" });
    }
};
