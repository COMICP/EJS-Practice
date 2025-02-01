// Needed Resources
const express = require("express");
const router = new express.Router();
const envController = require("../controllers/accountController");
const utilities = require("../utilities/");
// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(envController.buildLogin));

module.exports = router;
