const getUserSkillsData = require("../fetchData/userSkills");
const getUserProfileData = require("../fetchData/userProfile");
const getUserAttendanceData = require("../fetchData/userAttendance");
const getUserRequestData = require("../fetchData/userRequest");
const getUserProjectListData = require("../fetchData/userProjectList");
const getUserTimesheetData = require("../fetchData/userTimesheet");

const createDashboardData = (dashboard, data, location) => {
  if (data == null) {
    dashboard[location] = { message: "No data available" };
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
    dashboardData,
    userSkillsData,
    "userSkills");

  const userProfileData = await getUserProfileData.fetchProfile(
    req.user.userEmail
  );
  createDashboardData(
    dashboardData,
    userProfileData,
    "userProfile"
  );

  const userAttendanceData = await getUserAttendanceData.fetchAttendance(
    req.user.userEmail
  );
  createDashboardData(
    dashboardData,
    userAttendanceData,
    "userAttendanceList"
  );

  const userRequestData = await getUserRequestData.fetchRequest(
    req.user.userEmail
  );
  createDashboardData(
    dashboardData,
    userRequestData,
    "userRequestList"
  );

  const userProjectListData = await getUserProjectListData.fetchProjectList(
    req.user.userEmail
  );
  createDashboardData(
    dashboardData,
    userProjectListData,
    "userProjectList"
  );

  const userTimesheetData = await getUserTimesheetData.fetchTimesheet(
    req.user.userEmail
  );
  createDashboardData(
    dashboardData,
    userTimesheetData,
    "userTimesheetList"
  );

  res.status(200).json(dashboardData);
};