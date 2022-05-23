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

// search profile from the database.
exports.find = (req, res) => {
  // set req parms
  const find = req.query.find;

  // find the profile in db
  Profile.findAll({
    where: {
      name: {
        [db.Sequelize.Op.like]: `%${find}%`,
      },
    },
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
        location: "profile.controller.find.1",
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

// create a profile in the database.
exports.create = function (req, res, next) {
  // get the info from json
  const json = req.body;

  // set the vars from post
  const name = json.name;
  const price = json.price;

  // check if name is present
  if (!name) {
    // retun the correct vars
    return res.status(400).json({
      message: "Name input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if price is present
  if (!price) {
    // retun the correct vars
    return res.status(400).json({
      message: "Price input value missing",
      reqid: res.locals.reqid,
    });
  }

  // create uuid
  const id = crypto.randomUUID();

  // create profile object
  const profile = {
    id: id,
    name: name,
    price: price,
  };

  // Create profile in the database
  Profile.create(profile)
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
        location: "profile.controller.create.1",
        code: error.code,
        message:
          error.message || "Some error occurred while creating the profile.",
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

// delete profile from the database.
exports.delete = (req, res) => {
  // get req params
  const id = req.params.id;

  // Delete the specific profile in db
  Profile.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        // retun the correct vars
        res.status(200).json({
          message: "okay",
          reqid: res.locals.reqid,
        });
      } else {
        // retun the correct vars
        res.status(400).json({
          message: "ProfileId invalid",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "profile.controller.delete.1",
        code: error.code,
        message:
          error.message || "Some error occurred while deleting the profile",
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
