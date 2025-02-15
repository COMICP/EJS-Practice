const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");

// /*  **********************************
//  *  Registration Data Validation Rules
//  * ********************************* */
// validate.classRules = () => {
//   return [
//     // class is required and must be string with no spaces
//     body("classification_name")
//       .trim()
//       .withMessage("Class Must be string")
//       .custom(async (classification_name) => {
//         const classExists = await invModel.checkExistingClass(
//           classification_name
//         );
//         if (classExists) {
//           throw new Error("Email exists. Please log in or use different email");
//         }
//       })

//       .withMessage("class does not meet requirements."),
//   ];
// };

// /* ******************************
//  * Check data and return errors or continue to registration
//  * ***************************** */
// validate.checkRegData = async (req, res, next) => {
//   const classification_name = req.body;
//   let errors = [];
//   errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     let nav = await utilities.getNav();
//     res.render("account/register", {
//       errors,
//       title: "Add New Vehicle Class",
//       nav,
//       classification_name,
//     });
//     return;
//   }
//   next();
// };
/*  **********************************
 *  Classification Data Validation Rule
 * ********************************* */
validate.classificationRule = () => {
  return [
    // name is required and must be string
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Provide a correct classification name."),
  ];
};
validate.InventoryRules = () => {
  return [
    // name is required and must be string
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Provide a correct input. make"),
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Provide a correct input. model"),
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Provide a correct input. description"),
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Provide a correct input. image"),
    body("inv_thumbnail")
      .isLength({ min: 1 })
      .withMessage("Provide a correct input. thumbnail"),
    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .isHexadecimal()
      .withMessage("Provide a correct input. price"),
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .isHexadecimal()
      .withMessage("Provide a correct input. year"),
    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .isHexadecimal()
      .withMessage("Provide a correct input. miles"),
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .isString()
      .withMessage("Provide a correct input. color"),
  ];
};

/* ******************************
 * Check and return error or continue to insert classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};
validate.checkItemData = async (req, res, next) => {
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
  let errors = [];
  errors = validationResult(req);
  let drop = await utilities.buildClassificationList();
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      drop,
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
    });
    return;
  }
  next();
};

validate.checkUpdeatedData = async (req, res, next) => {
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
    inv_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  let drop = await utilities.buildClassificationList();
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit Inventory",
      nav,
      drop,
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
      inv_id,
    });
    return;
  }
  next();
};
validate.checkReviewData = async (req, res, next) => {
  
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    const itemID = req.body.inv_id;
    const inv_id = req.body.inv_id;
    const data = await invModel.getDetailsByItem(itemID);
    console.log(itemID)
    console.log(data)
    //console.log(data[0]);
    const details = await utilities.buildDetailsPage(data[0]);
    //console.log(details);
    const reviews = await utilities.buildReviews(itemID);
    let nav = await utilities.getNav();
    const nameManufact = data[0].inv_make + " " + data[0].inv_model;
    res.render("./inventory/detail", {
      title: nameManufact,
      nav,
      details,
      reviews,
      inv_id,
      errors,
    });
    return;
  }
  next();
};
validate.revrule = () => {
  console.log("checking results");
  return [

    body("name")
      .isLength({ min: 1 })
      .withMessage("Provide a correct name."),
    body("review_text")
      .isLength({ min: 1 })
      .withMessage("Provide review text."),
  ];
};
module.exports = validate;
