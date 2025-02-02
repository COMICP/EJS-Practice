// Needed Resources
const express = require("express");
const router = new express.Router();
const envController = require("../controllers/accountController");
const utilities = require("../utilities/");
// Route to build inventory by classification view
router.get(
  "/registration",
  utilities.handleErrors(envController.buildRegister)
);
router.get("/login", utilities.handleErrors(envController.buildLogin));
router.post(
  "/register",
  utilities.handleErrors(envController.registerAccount)
);

module.exports = router;
