const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadUser');
const adminAddUsersController = require('../controllers/adminController/adminAddUsers');

router.post(
	'/upload-user-details',
	upload.single('csvFile'),
	adminAddUsersController.postUploadUserDetails,
);

module.exports = router;
