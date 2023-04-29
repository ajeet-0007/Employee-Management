const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadUser');
const adminUserController = require('../controllers/adminController/adminUser');
const adminProjectController = require('../controllers/adminController/adminProject');

router.post(
	'/upload-user-details',
	upload.single('csvFile'),
	adminUserController.postUploadUserDetails
);

router.post('/add-user-project', adminProjectController.postUserProject);

router.get('/get-all-users', adminUserController.getAllUsers);

module.exports = router;
