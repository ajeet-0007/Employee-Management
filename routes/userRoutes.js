const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController')

router.post('/signup', userController.postSignUp);

router.post('/login', userController.postLogin);


// router.post('/forgotpassword');

module.exports = router;