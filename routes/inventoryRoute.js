// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// route to build individual Item
router.get("/detail/:inv_id", invController.buildDetailsById);
module.exports = router;
