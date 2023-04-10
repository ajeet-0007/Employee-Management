const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadUser');
const adminUserController = require('../controllers/adminController/adminUser');

router.post(
	'/upload-user-details',
	upload.single('csvFile'),
	adminUserController.postUploadUserDetails
);

router.get('/get-all-users', adminUserController.getAllUsers);

module.exports = router;
