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
const authorize = require('../middlewares/authorize');

const { send, sendTo } = require('../events/sendNotification');

const returnRouter = (io) => {
	io.on('connection', async (socket) => {
		const id = socket.user.userId; // ID is the userId of the user
		const userData = await db.sequelize.query('EXEC dbo.spusers_getuser :userId', {
			replacements: { userId: id }
		});
		const HRM_ID = userData[0][0].hrmid; // HRM_ID of the user

		socket.join(HRM_ID); // always join with HRM_ID

		send(io, HRM_ID); // emit socket event to send all notifications to the user
	});

	router.use((req, res, next) => {
		req.io = io;
		// req.socket = socketOb;
		next();
	});

	router.post('/check-in', authorize, userAttendanceController.postCheckIn);

	router.post('/requests/add-user-request', authorize, userRequestController.postUserRequest);

	router.post('/requests/resend-user-request', authorize, userRequestController.resendUserRequest);

	router.post('/timesheets/add-user-timesheet', authorize, userTimesheetController.postUserTimesheet);

	router.put('/skills/update-user-skills', authorize, userSkillsController.updateUserSkills);

	router.put('/account/update-user-profile', authorize, userProfileController.updateUserProfile);

	router.put('/requests/update-user-request', authorize, userRequestController.updateUserRequest);

	router.put('/requests/update-user-subordinate-request', authorize, userRequestController.updateUserSubordinateRequest);

	router.put('/timesheets/update-user-subordinate-timesheet', authorize, userTimesheetController.updateUserTimesheetRequest);

	router.put('/check-out', authorize, userAttendanceController.putCheckOut);

	router.get('/logout', authorize, userLoginController.getLogout);

	router.get('/get-user', authorize, userController.getUser);

	router.get('/get-searched-user', authorize, userController.getSearchedUser);

	router.get('/get-all-users', authorize, userController.getAllUsers);

	router.get('/account/get-user-profile', authorize, userProfileController.getUserProfile);

	router.get('/requests/get-user-requests', authorize, userRequestController.getUserRequests);

	router.get('/requests/get-user-available-requests', authorize, userRequestController.getUserAvailableRequests);

	router.get('/requests/get-user-subordinates-requests', authorize, userRequestController.getUserSubordinatesRequests);

	router.get('/get-user-attendance', authorize, userAttendanceController.getUserAttendance);

	router.get('/get-user-current-attendance', authorize, userAttendanceController.getUserCurrentAttendance);

	router.get('/skills/get-user-skills', authorize, userSkillsController.getUserSkills);

	router.get('/timesheets/get-user-timesheets', authorize, userTimesheetController.getUserTimesheets);

	router.get('/timesheets/get-user-weekly-timesheets', authorize, userTimesheetController.getUserWeeklyTimesheets);

	router.get('/timesheets/get-user-subordinates-timesheets', authorize, userTimesheetController.getUserSubordinatesTimesheets);

	router.get('/get-user-projects', authorize, userProjectController.getUserProjects);

	router.get('/get-user-projects-minimal-data', authorize, userProjectController.getUserProjectsMinimalData);

	router.get('/get-user-hierarchy', authorize, userHierarchyController.getUserHierarchy);

	return router;
};

module.exports = returnRouter;
