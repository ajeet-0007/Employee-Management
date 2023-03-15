const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

router.post("/signup", userController.postSignUp);

router.post("/login", userController.postLogin);

router.get("/logout", userController.getLogout);

router.post("/account/add-user-details", userController.postUserProfileDetails);

router.post("/skills/add-skills", userController.postUserAddSkills);

router.post("/requests/add-request", userController.postUserRequest);

router.post("/check-in", userController.postCheckIn);

router.post("/check-out", userController.postCheckOut);

router.post("/forgotpassword");

module.exports = router;
