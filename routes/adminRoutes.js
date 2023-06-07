const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadUser');
const adminUserController = require('../controllers/adminController/adminUser');
const adminProjectController = require('../controllers/adminController/adminProject');
const { adminAuthorize } = require('../middlewares/authorize');

router.post('/upload-user-details', adminAuthorize, upload.single('csvFile'), adminUserController.postUploadUserDetails);

router.post('/add-user', adminAuthorize, adminUserController.postUser);

router.post('/add-user-project', adminAuthorize, adminProjectController.postUserProject);

router.get('/get-all-users', adminAuthorize, adminUserController.getAllUsers);

router.get('/get-all-projects', adminAuthorize, adminProjectController.getAllProjects);

module.exports = router;
