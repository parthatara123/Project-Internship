const express = require("express");
const router = express.Router();
const CollageController = require("../controller/collegeController");
const InternController = require("../controller/internController");

// Create college POST API
router.post("/funcitonup/collages", CollageController.createCollege);

// Create Intern POST API
router.post("/funcitonup/interns", InternController.createIntern);

// Get college details GET API
router.get('/functionup/collegeDetails', CollageController.collegeDetail)

module.exports = router;
