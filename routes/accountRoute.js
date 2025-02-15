// Needed Resources
const express = require("express");
const regValidate = require("../utilities/account-validation");

const router = new express.Router();
const envController = require("../controllers/accountController");
const utilities = require("../utilities/");
// Route to build inventory by classification view
router.get(
  "/registration",
  utilities.handleErrors(envController.buildRegister)
);
router.get("/login", utilities.handleErrors(envController.buildLogin));
// Process the registration data
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(envController.buildAccount)
);
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(envController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  // regValidate.loginRules(),
  // regValidate.checkLoginData,
  utilities.handleErrors(envController.accountLogin)
);

module.exports = router;
