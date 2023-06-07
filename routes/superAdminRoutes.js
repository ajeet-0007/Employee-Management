const express = require('express');
const router = express.Router();
const superAdminUserController = require('../controllers/superAdminController/superAdminUser');

router.post('/add-admin', superAdminUserController.postAdmin);

module.exports = router;
