const getUserSkillsData = require("../fetchData/userSkills");
const getUserProfileData = require("../fetchData/userProfile");
const getUserAttendanceData = require("../fetchData/userAttendance");
const getUserRequestData = require("../fetchData/userRequest");
const getUserProjectData = require("../fetchData/userProject");
const getUserTimesheetData = require("../fetchData/userTimesheet");

const createDashboardData = (data, location, field, dashboard) => {
    if (data.length == 0) {
        dashboard[location] = { message: `No user ${field} found` };
    } else {
        dashboard[location] = data;
    }
};

exports.getUserDashboard = async (req, res) => {
    let dashboardData = {};

    const userSkillsData = await getUserSkillsData.fetchSkills(
        req.user.userEmail
    );
    createDashboardData(
        userSkillsData,
        "userSkills",
        "skills",
        dashboardData
    );

    const userProfileData = await getUserProfileData.fetchProfile(
        req.user.userEmail
    );
    createDashboardData(
        userProfileData,
        "userProfile",
        "profile",
        dashboardData
    );

    const userAttendanceData = await getUserAttendanceData.fetchAttendance(
        req.user.userEmail
    );
    createDashboardData(
        userAttendanceData,
        "userAttendance",
        "attendance",
        dashboardData
    );

    const userRequestData = await getUserRequestData.fetchRequests(
        req.user.userEmail
    );
    createDashboardData(
        userRequestData,
        "userRequests",
        "requests",
        dashboardData
    );

    const userProjectData = await getUserProjectData.fetchProjects(
        req.user.userEmail
    );
    createDashboardData(
        userProjectData,
        "userProjects",
        "projects",
        dashboardData
    );

    const userLatestTimesheetData = await getUserTimesheetData.fetchLatestTimesheets(
        req.user.userEmail
    );
    createDashboardData(
        userLatestTimesheetData,
        "userLatestTimesheets",
        "timesheets",
        dashboardData
    );

    res.status(200).json({ data: dashboardData });
};
