// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const db = require("../models");

// load the db
const Profile = db.profiles;

// get all profiles from the database.
exports.list = (req, res) => {
  Profile.findAll({
    order: [["price", "DESC"]],
  })
    .then((data) => {
      // retun the correct vars
      res.status(200).json({
        payload: data,
        message: "okay",
        reqid: res.locals.reqid,
      });
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "profile.controller.list.1",
        code: error.code,
        message:
          error.message || "Some error occurred while finding the profiles",
        from: "sequelize",
      });

      // return the correct vars
      res.status(500).json({
        message: "Server error",
        errors: res.locals.errors,
        reqid: res.locals.reqid,
      });
    });
};