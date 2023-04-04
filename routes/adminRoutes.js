const express = require("express");
const router = express.Router();
const adminAddUsersController = require("../controllers/adminController/adminAddUsers");

router.post(
  "/upload-user-details",
  adminAddUsersController.upload.single("csvFile"),
  adminAddUsersController.postUploadUserDetails
);

module.exports = router;
