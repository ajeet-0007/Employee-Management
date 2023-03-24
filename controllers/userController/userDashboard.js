const db = require("../../models");
const getUserSkillsData = require("../fetchData/userSkills");
const getUserProfileData = require("../fetchData/userProfile");
const getUserAttendanceData = require("../fetchData/userAttendance");
const getUserRequestData = require("../fetchData/userRequest");
const getUserProjectListData = require("../fetchData/userProjectList");
const getUserTimesheetData = require("../fetchData/userTimesheet");

const createDashboardData = (dashboard, data, message, location) => {
  if (data == null) {
    dashboard[location] = message;
  } else {
    dashboard[location] = data;
  }
};

exports.getUserDashboard = async (req, res) => {
  let dashboardData = {};
  let message = { message: "no data availabe" };

  const userSkillsData = await getUserSkillsData.fetchSkills(
    req.user.userEmail
  );
  createDashboardData(dashboardData, userSkillsData, message, "userSkillsList");

  const userProfileData = await getUserProfileData.fetchProfile(
    req.user.userEmail
  );
  createDashboardData(
    dashboardData,
    userProfileData,
    message,
    "userProfileList"
  );

  const userAttendanceData = await getUserAttendanceData.fetchAttendance(
    req.user.userEmail
  );
  createDashboardData(
    dashboardData,
    userAttendanceData,
    message,
    "userAttendanceList"
  );

  const userRequestData = await getUserRequestData.fetchRequest(
    req.user.userEmail
  );
  createDashboardData(
    dashboardData,
    userRequestData,
    message,
    "userRequestList"
  );

  const userProjectListData = await getUserProjectListData.fetchProjectList(
    req.user.userEmail
  );
  createDashboardData(
    dashboardData,
    userProjectListData,
    message,
    "userProjectList"
  );

  const userTimesheetData = await getUserTimesheetData.fetchTimesheet(
    req.user.userEmail
  );
  createDashboardData(
    dashboardData,
    userTimesheetData,
    message,
    "userTimesheet"
  );

  res.status(200).json(dashboardData);
};
