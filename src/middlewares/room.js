const validator = async (req, res, next) => {
  req.checkBody("title").notEmpty().withMessage("Title field is required");
  req
    .checkBody("description")
    .notEmpty()
    .withMessage("description field is required");
  req
    .checkBody("pricePerNight")
    .notEmpty()
    .withMessage("pricePerNight field is required")
    .isFloat({ min: 1, max: 20000000 })
    .withMessage("Price must be a number between 1 and 20000000");
  req
    .checkBody("propertyType")
    .notEmpty()
    .withMessage("propertyType field is required");

  req
    .checkBody("guests")
    .notEmpty()
    .withMessage("guests field is required")
    .isFloat({ min: 1, max: 30 })
    .withMessage("guests must be a number between 1 and 30");
  req
    .checkBody("bedrooms")
    .notEmpty()
    .withMessage("bedrooms field is required")
    .isFloat({ min: 1, max: 30 })
    .withMessage("bedrooms must be a number between 1 and 30");

  req
    .checkBody("beds")
    .notEmpty()
    .withMessage("beds field is required")
    .isFloat({ min: 1, max: 30 })
    .withMessage("beds must be a number between 1 and 30");

  req
    .checkBody("baths")
    .notEmpty()
    .withMessage("baths field is required")
    .isFloat({ min: 1, max: 30 })
    .withMessage("baths must be a number between 1 and 30");

  req
    .checkBody("locationX")
    .notEmpty()
    .withMessage("locationX field is required");

  req
    .checkBody("locationY")
    .notEmpty()
    .withMessage("locationY field is required");

  req.checkBody("address").notEmpty().withMessage("address field is required");

  req
    .checkBody("retype_password")
    .notEmpty()
    .withMessage("Retyp password field is required");

  req
    .asyncValidationErrors()
    .then(function () {
      next();
    })
    .catch(function (errors) {
      req.flash("errors", errors);
      res.status(500).redirect("back");
    });
};

module.exports = { validator };
