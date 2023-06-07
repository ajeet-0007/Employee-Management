const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController/user');
const userLoginController = require('../controllers/userController/userLogin');
const userProfileController = require('../controllers/userController/userProfile');
const userAttendanceController = require('../controllers/userController/userAttendance');
const userRequestController = require('../controllers/userController/userRequest');
const userSkillsController = require('../controllers/userController/userSkills');
const userTimesheetController = require('../controllers/userController/userTimesheet');
const userProjectController = require('../controllers/userController/userProject');
const userHierarchyController = require('../controllers/userController/userHierarchy');
const userNotificationController = require('../controllers/userController/userNotification');
const { userAuthorize } = require('../middlewares/authorize');
const { send } = require('../events/sendNotification');
const { getUser } = require('../controllers/fetchData/user');

const returnRouter = (io) => {
	io.on('connection', async (socket) => {
		const userData = await getUser(socket.user.userId);
		socket.join(userData.hrmid); // Always join with hrmid
		send(io, userData.hrmid); // Emit socket event to send all notifications to the user
	});

	router.use((req, res, next) => {
		req.io = io;
		next();
	});

	router.post('/check-in', userAuthorize, userAttendanceController.postCheckIn);

	router.post('/requests/add-user-request', userAuthorize, userRequestController.postUserRequest);

	router.post('/requests/resend-user-request', userAuthorize, userRequestController.resendUserRequest);

	router.post('/timesheets/add-user-timesheet', userAuthorize, userTimesheetController.postUserTimesheet);

	router.put('/skills/update-user-skills', userAuthorize, userSkillsController.updateUserSkills);

	router.put('/account/update-user-profile', userAuthorize, userProfileController.updateUserProfile);

	router.put('/requests/update-user-request', userAuthorize, userRequestController.updateUserRequest);

	router.put('/requests/update-user-subordinate-request', userAuthorize, userRequestController.updateUserSubordinateRequest);

	router.put('/timesheets/update-user-subordinate-timesheet', userAuthorize, userTimesheetController.updateUserSubordinateTimesheet);

	router.put('/update-user-notification', userAuthorize, userNotificationController.updateUserNotification);

	router.put('/update-all-user-notifications', userAuthorize, userNotificationController.updateAllUserNotifications);

	router.put('/check-out', userAuthorize, userAttendanceController.putCheckOut);

	router.get('/get-user', userAuthorize, userController.getUser);

	router.get('/get-searched-user', userAuthorize, userController.getSearchedUser);

	router.get('/get-all-users', userAuthorize, userController.getAllUsers);

	router.get('/account/get-user-profile', userAuthorize, userProfileController.getUserProfile);

	router.get('/requests/get-user-requests', userAuthorize, userRequestController.getUserRequests);

	router.get('/requests/get-user-available-requests', userAuthorize, userRequestController.getUserAvailableRequests);

	router.get('/requests/get-user-subordinates-requests', userAuthorize, userRequestController.getUserSubordinatesRequests);

	router.get('/get-user-attendance', userAuthorize, userAttendanceController.getUserAttendance);

	router.get('/get-user-current-attendance', userAuthorize, userAttendanceController.getUserCurrentAttendance);

	router.get('/skills/get-user-skills', userAuthorize, userSkillsController.getUserSkills);

	router.get('/timesheets/get-user-timesheets', userAuthorize, userTimesheetController.getUserTimesheets);

	router.get('/timesheets/get-user-weekly-timesheets', userAuthorize, userTimesheetController.getUserWeeklyTimesheets);

	router.get('/timesheets/get-user-subordinates-timesheets', userAuthorize, userTimesheetController.getUserSubordinatesTimesheets);

	router.get('/get-user-projects', userAuthorize, userProjectController.getUserProjects);

	router.get('/get-user-projects-minimal-data', userAuthorize, userProjectController.getUserProjectsMinimalData);

	router.get('/get-user-hierarchy', userAuthorize, userHierarchyController.getUserHierarchy);

	router.get('/logout', userLoginController.getLogout);

	return router;
};

module.exports = returnRouter;
