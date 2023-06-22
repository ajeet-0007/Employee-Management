const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadUser');
const adminController = require('../controllers/adminController/admin');
const adminLoginController = require('../controllers/adminController/adminLogin');
const adminUserController = require('../controllers/adminController/adminUser');
const adminProjectController = require('../controllers/adminController/adminProject');
const adminRequestController = require('../controllers/adminController/adminRequest');
const adminTimesheetController = require('../controllers/adminController/adminTimesheet');
const userHierarchyController = require('../controllers/userController/userHierarchy');
const { adminAuthorize } = require('../middlewares/authorize');

router.post('/upload-user-details', adminAuthorize, upload.single('csvFile'), adminUserController.postUploadUserDetails);

router.post('/add-user', adminAuthorize, adminUserController.postUser);

router.post('/projects/add-project', adminAuthorize, adminProjectController.postProject);

router.delete('/projects/delete-project', adminAuthorize, adminProjectController.deleteProject);

router.put('/projects/update-project', adminAuthorize, adminProjectController.putProject);

router.put('/update-user', adminAuthorize, adminUserController.putUser);

router.get('/get-admin', adminAuthorize, adminController.getAdmin);

router.get('/get-users', adminAuthorize, adminUserController.getUsers);

router.get('/get-all-users', adminAuthorize, adminUserController.getAllUsers);

router.get('/get-searched-user', adminAuthorize, adminUserController.getSearchedUser);

router.get('/get-user-skills', adminAuthorize, adminUserController.getUserSkills);

router.get('/get-hierarchy', adminAuthorize, userHierarchyController.getUserHierarchy);

router.get('/projects/get-projects', adminAuthorize, adminProjectController.getProjects);

router.get('/requests/get-range-requests', adminAuthorize, adminRequestController.getRangeRequests);

router.get('/timesheets/get-range-timesheets', adminAuthorize, adminTimesheetController.getRangeTimesheets);

router.get('/projects/get-project', adminAuthorize, adminProjectController.getProject);

router.get('/logout', adminLoginController.getLogout);

module.exports = router;
