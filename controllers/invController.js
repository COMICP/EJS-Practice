const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};
const item = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  console.log(data);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  console.log(className);
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  console.log(inv_id);
  let nav = await utilities.getNav();
  let drop = await utilities.buildClassificationList();
  const itemData = await invModel.getInventoryByClassificationId(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData[0].classification_id
  );
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    drop,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id,
  });
};
invCont.buildDetailsById = async function (req, res, next) {
  const itemID = req.params.inv_id;
  const data = await invModel.getDetailsByItem(itemID);
  console.log(data[0]);
  const details = await utilities.buildDetailsPage(data[0]);
  console.log(details);
  let nav = await utilities.getNav();
  const nameManufact = data[0].inv_make + " " + data[0].inv_model;
  res.render("./inventory/detail", {
    title: nameManufact,
    nav,
    details,
  });
};

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Management",
    classificationSelect,
    nav,
  });
};

invCont.buildNewClass = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-Classification", {
    title: "Add New Vehicle Class",
    nav,
    errors: null,
  });
};

invCont.buildNewItem = async function (req, res, next) {
  let nav = await utilities.getNav();
  let drop = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    drop,
    errors: null,
  });
};

/* ****************************************
 *  Process Registration
 * *************************************** */
invCont.registerClass = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const regResult = await invModel.registerSQLClass(classification_name);

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve registered ${classification_name}. `
    );
    res.status(201).redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Management",
      nav,
    });
  }
};
invCont.registerItem = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  const regResult = await invModel.registerVehicle(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );
  if (regResult) {
    req.flash("notice", `Congratulations, you\'ve registered ${inv_model}. `);
    res.status(201).redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).redirect("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
    });
  }
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

module.exports = invCont;
