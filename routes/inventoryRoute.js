// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invRules = require("../utilities/inventory-validation");
// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
// route to build individual Item
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildDetailsById)
);
// route to build Management Page
router.get("/", utilities.handleErrors(invController.buildManagement));

router.get(
  "/newClassification",
  utilities.handleErrors(invController.buildNewClass)
);

router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildNewItem)
);
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);
//edit item view

router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
);
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteInventoryView)
);
router.post(
  "/newClassification",
  invRules.classificationRule(),
  invRules.checkClassificationData,
  utilities.handleErrors(invController.registerClass)
);
router.post(
  "/add-inventory",
  invRules.InventoryRules(),
  invRules.checkItemData,
  utilities.handleErrors(invController.registerItem)
);
router.post("/edit/",
  //invRules.InventoryRules(),
  invRules.checkUpdeatedData,
  utilities.handleErrors(invController.updateInventory));

module.exports = router;
