// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const db = require("../models");

// load the db
const Screen = db.screens;
const Seat = db.seats;
const Type = db.types;

// get all screens from the database.
exports.list = (req, res) => {
  Screen.findAll({ order: [["name", "ASC"]] })
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
        location: "screen.controller.list.1",
        code: error.code,
        message:
          error.message || "Some error occurred while finding the screens",
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

// search screen from the database.
exports.find = (req, res) => {
  // set req parms
  const find = req.query.find;

  // find the screen in db
  Screen.findAll({
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
        location: "screen.controller.find.1",
        code: error.code,
        message:
          error.message || "Some error occurred while finding the screens",
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

// get specific screen from the database.
exports.info = (req, res) => {
  // get req params
  const id = req.params.id;

  // Find the specific screen in db
  Screen.findByPk(id, {
    include: [
      {
        model: Seat,
        as: "seats",
        attributes: ["id", "name", "x", "y"],
        include: [
          {
            model: Type,
            as: "type",
            attributes: ["name", "color"],
          },
        ],
      },
    ],
  })
    .then((data) => {
      if (data) {
        // retun the correct vars
        res.status(200).json({
          payload: data,
          message: "okay",
          reqid: res.locals.reqid,
        });
      } else {
        // retun the correct vars
        res.status(400).json({
          message: "Screen not found",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "screen.controller.info.1",
        code: error.code,
        message:
          error.message || "Some error occurred while finding the screen",
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

// create a screen in the database.
exports.create = function (req, res, next) {
  // get the info from json
  const json = req.body;

  // set the vars from post
  const name = json.name;
  const columns = json.columns;

  // check if name is present
  if (!name) {
    // retun the correct vars
    return res.status(400).json({
      message: "Name input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if columns is present
  if (!columns) {
    // retun the correct vars
    return res.status(400).json({
      message: "Columns input value missing",
      reqid: res.locals.reqid,
    });
  }

  // create uuid
  const id = crypto.randomUUID();

  // create screen object
  const screen = {
    id: id,
    name: name,
    columns: columns,
  };

  // Create screen in the database
  Screen.create(screen)
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
        location: "screen.controller.create.1",
        code: error.code,
        message:
          error.message || "Some error occurred while creating the screen.",
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

// update screen from the database.
exports.edit = (req, res) => {
  // get req params
  const id = req.params.id;

  // get the info from json
  const json = req.body;

  // set the vars from post
  const name = json.name;
  const columns = json.columns;

  // check if name is present
  if (!name) {
    // retun the correct vars
    return res.status(400).json({
      message: "Name input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if columns is present
  if (!columns) {
    // retun the correct vars
    return res.status(400).json({
      message: "Columns input value missing",
      reqid: res.locals.reqid,
    });
  }

  // create screen object
  const screen = {
    name: name,
    columns: columns,
  };

  // update the specific screen in the db
  Screen.update(screen, {
    where: {
      id: id,
    },
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
          message: "Screen not updated",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "screen.controller.info.1",
        code: error.code,
        message:
          error.message || "Some error occurred while updating the screen",
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

// delete screen from the database.
exports.delete = (req, res) => {
  // get req params
  const id = req.params.id;

  // Delete the specific screen in db
  Screen.destroy({
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
          message: "ScreenId invalid",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "screen.controller.delete.1",
        code: error.code,
        message:
          error.message || "Some error occurred while deleting the screen",
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
