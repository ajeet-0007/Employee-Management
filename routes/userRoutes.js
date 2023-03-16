const express = require("express");
const authorize = require("../middlewares/authorize");

const router = express.Router();

const userController = require("../controllers/userController");

router.post("/signup", userController.postSignUp);

router.post("/login", userController.postLogin);

router.get("/logout",authorize, userController.getLogout);

router.post("/account/add-user-details", userController.postUserProfileDetails);

router.post("/skills/add-skills", userController.postUserAddSkills);

router.post("/requests/add-request", userController.postUserRequest);

router.post("/check-in", userController.postCheckIn);

router.put("/check-out", userController.postCheckOut);

router.get('/farzi',authorize, userController.farzi);
router.post("/forgotpassword");

module.exports = router;
