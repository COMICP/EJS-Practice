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
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildDetailsById = async function (req, res, next) {
  const itemID = req.params.inv_id;
  const data = await invModel.getDetailsByItem(itemID);
  console.log(data[0])
  const details = await utilities.buildDetailsPage(data[0]);
  console.log(details)
  let nav = await utilities.getNav();
  const nameManufact = data[0].inv_make+' '+ data[0].inv_model;
  res.render("./inventory/detail", {
    title: nameManufact,
    nav,
    details,
  });
};

module.exports = invCont;
