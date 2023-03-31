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
        "userAttendanceList",
        "attendance",
        dashboardData
    );

    const userRequestData = await getUserRequestData.fetchRequests(
        req.user.userEmail
    );
    createDashboardData(
        userRequestData,
        "userRequestList",
        "requests",
        dashboardData
    );

    const userProjectData = await getUserProjectData.fetchProjects(
        req.user.userEmail
    );
    createDashboardData(
        userProjectData,
        "userProjectList",
        "projects",
        dashboardData
    );

    const userTimesheetData = await getUserTimesheetData.fetchTimesheets(
        req.user.userEmail
    );
    createDashboardData(
        userTimesheetData,
        "userTimesheetList",
        "timesheets",
        dashboardData
    );

    res.status(200).json({ data: dashboardData });
};
