const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadUser');
const adminController = require('../controllers/adminController/admin');
const adminLoginController = require('../controllers/adminController/adminLogin');
const adminUserController = require('../controllers/adminController/adminUser');
const adminProjectController = require('../controllers/adminController/adminProject');
const userHierarchyController = require('../controllers/userController/userHierarchy');
const { adminAuthorize } = require('../middlewares/authorize');

router.post('/upload-user-details', adminAuthorize, upload.single('csvFile'), adminUserController.postUploadUserDetails);

router.post('/add-user', adminAuthorize, adminUserController.postUser);

router.post('/add-user-project', adminAuthorize, adminProjectController.postUserProject);

router.get('/get-admin', adminAuthorize, adminController.getAdmin);

router.get('/get-users', adminAuthorize, adminUserController.getUsers);

router.get('/get-all-users', adminAuthorize, adminUserController.getAllUsers);

router.get('/get-searched-user', adminAuthorize, adminUserController.getSearchedUser);

router.get('/get-hierarchy', adminAuthorize, userHierarchyController.getUserHierarchy);

router.get('/get-projects', adminAuthorize, adminProjectController.getProjects);

router.get('/logout', adminLoginController.getLogout);

module.exports = router;
