const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize");
const userController = require("../controllers/userController/user");
const userDashboardController = require("../controllers/userController/userDashboard");
const userLoginController = require('../controllers/userController/userLogin')
const userProfileController = require("../controllers/userController/userProfile");
const userAttendanceController = require("../controllers/userController/userAttendance");
const userRequestController = require("../controllers/userController/userRequest");
const userSkillsController = require("../controllers/userController/userSkills");
const userTimesheetController = require("../controllers/userController/userTimesheet");
const userProjectController = require("../controllers/userController/userProject");

router.post("/account/add-user-profile", authorize, userProfileController.postUserProfile);

router.post("/skills/add-user-skills", authorize, userSkillsController.postUserAddSkills);

router.post("/requests/add-user-request", authorize, userRequestController.postUserRequest);

router.post("/add-user-timesheet", authorize, userTimesheetController.postUserTimesheet);

router.post("/add-user-project", authorize, userProjectController.postUserProject);

router.post("/check-in", authorize, userAttendanceController.postCheckIn);

router.put("/skills/update-user-skills", authorize, userSkillsController.updateUserSkills);

router.put("/account/update-user-profile", authorize, userProfileController.updateUserProfile);

router.put("/check-out", authorize, userAttendanceController.putCheckOut);

router.get("/dashboard",authorize, userDashboardController.getUserDashboard);

router.get("/logout", authorize, userLoginController.getLogout);

router.get("/get-user", authorize, userController.getUser);

router.get("/account/get-user-profile", authorize, userProfileController.getUserProfile);

router.get("/requests/get-user-requests", authorize, userRequestController.getUserRequests);

router.get("/get-user-attendance", authorize, userAttendanceController.getUserAttendance);

router.get("/skills/get-user-skills", authorize, userSkillsController.getUserSkills);

router.get('/get-user-timesheets', authorize, userTimesheetController.getUserTimesheets);

router.get('/get-user-latest-timesheets', authorize, userTimesheetController.getUserLatestTimesheets);

router.get("/get-user-projects", authorize, userProjectController.getUserProjects);

module.exports = router;