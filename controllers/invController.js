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
  res.render("./inventory/management", {
    title: "Management",
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
  let drop = await utilities.buildClassificationList()
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
  const {   classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color } = req.body;

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
    req.flash(
      "notice",
      `Congratulations, you\'ve registered ${inv_model}. `
    );
    res.status(201).redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).redirect("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
    });
  }
};
module.exports = invCont;
