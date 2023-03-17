const express = require("express");
const authorize = require("../middlewares/authorize");

const router = express.Router();

const userController = require("../controllers/userController");

router.post("/signup", userController.postSignUp);

router.post("/login", userController.postLogin);

router.get("/logout", authorize, userController.getLogout);

router.post("/account/add-user-profile", authorize, userController.postUserProfile);

router.post("/skills/add-skills", authorize, userController.postUserAddSkills);

router.post("/requests/add-request", authorize, userController.postUserRequest);

router.post("/check-in", authorize, userController.postCheckIn);

router.get("/account/get-user", authorize, userController.getUser);

router.get("/requests/get-user-requests", authorize, userController.getUserRequests);

router.get("/get-user-profile", authorize, userController.getUserProfile);

router.get("/get-user-attendance", authorize, userController.getUserAttendance);

router.get("/skills/get-user-skills", authorize, userController.getUserSkills);

router.put("/check-out", authorize, userController.postCheckOut);

router.put("/skills/update-user-skills", authorize, userController.updateUserSkills);

router.put("/account/update-user-profile", authorize, userController.updateUserProfile);

// router.post("/forgotpassword");

module.exports = router;
