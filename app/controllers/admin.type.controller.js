// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const db = require("../models");

// load the db
const Type = db.types;

// get all types from the database.
exports.list = (req, res) => {
  Type.findAll({
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
        location: "admin.type.controller.list.1",
        code: error.code,
        message: error.message || "Some error occurred while finding the types",
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

// search type from the database.
exports.find = (req, res) => {
  // set req parms
  const find = req.query.find;

  // find the type in db
  Type.findAll({
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
        location: "admin.type.controller.find.1",
        code: error.code,
        message: error.message || "Some error occurred while finding the types",
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

// create a type in the database.
exports.create = function (req, res, next) {
  // get the info from json
  const json = req.body;

  // set the vars from post
  const name = json.name;
  const color = json.color;
  const price = json.price;

  // check if name is present
  if (!name) {
    // retun the correct vars
    return res.status(400).json({
      message: "Name input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if color is present
  if (!color) {
    // retun the correct vars
    return res.status(400).json({
      message: "Color input value missing",
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

  // create type object
  const type = {
    id: id,
    name: name,
    color: color,
    price: price,
  };

  // Create type in the database
  Type.create(type)
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
        location: "admin.type.controller.create.1",
        code: error.code,
        message:
          error.message || "Some error occurred while creating the type.",
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

// delete type from the database.
exports.delete = (req, res) => {
  // get req params
  const id = req.params.id;

  // Delete the specific type in db
  Type.destroy({
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
          message: "TypeId invalid",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "admin.type.controller.delete.1",
        code: error.code,
        message: error.message || "Some error occurred while deleting the type",
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
