// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const db = require("../models");

// load the db
const Screening = db.screenings;
const Screen = db.screens;
const Seat = db.seats;
const Type = db.types;

// get all screenings from the database.
exports.list = (req, res) => {
  Screening.findAll({ include: ["screen", "movie"] })
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
        location: "screening.controller.list.1",
        code: error.code,
        message:
          error.message || "Some error occurred while finding the screenings",
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

// get specific screening from the database.
exports.info = (req, res) => {
  // get req params
  const id = req.params.id;

  // Find the specific screening in db
  Screening.findByPk(id, {
    include: [
      {
        model: Screen,
        as: "screen",
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
      },
      "movie",
      db.seats,
    ],
  })
    .then((data) => {
      if (data) {

        let responseData = data.toJSON();

        responseData.screen.seats.map((item, key, list) => {
          let id = item.id;

          // check if seat is occupied
          let found = responseData.seats.find((seat) => seat.id === id);

          if (found) {
            responseData.screen.seats[key].occupied = true;
          } else {
            responseData.screen.seats[key].occupied = false;
          }

         })



        // retun the correct vars
        res.status(200).json({
          payload: responseData,
          message: "okay",
          reqid: res.locals.reqid,
        });
      } else {
        // retun the correct vars
        res.status(400).json({
          message: "Screening not found",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "screening.controller.info.1",
        code: error.code,
        message:
          error.message || "Some error occurred while finding the screening",
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

// create a screening in the database.
exports.create = function (req, res, next) {
  // get the info from json
  const json = req.body;

  // set the vars from post
  const time = json.time;
  const movieId = json.movieId;
  const screenId = json.screenId;

  // check if time is present
  if (!time) {
    // retun the correct vars
    return res.status(400).json({
      message: "Time input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if movieId is present
  if (!movieId) {
    // retun the correct vars
    return res.status(400).json({
      message: "MovieId input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if screenId is present
  if (!screenId) {
    // retun the correct vars
    return res.status(400).json({
      message: "ScreenId input value missing",
      reqid: res.locals.reqid,
    });
  }

  // create uuid
  const id = crypto.randomUUID();

  // create screening object
  const screening = {
    id: id,
    time: time,
    movieId: movieId,
    screenId: screenId,
  };

  // Create screening in the database
  Screening.create(screening)
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
        location: "screening.controller.create.1",
        code: error.code,
        message:
          error.message || "Some error occurred while creating the screening",
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

// update screening from the database.
exports.edit = (req, res) => {
  // get req params
  const id = req.params.id;

  // get the info from json
  const json = req.body;

  // set the vars from post
  const time = json.time;

  // check if time is present
  if (!time) {
    // retun the correct vars
    return res.status(400).json({
      message: "Time input value missing",
      reqid: res.locals.reqid,
    });
  }

  // create screening object
  const screening = {
    time: time,
  };

  // Update the specific screening in the db
  Screening.update(screening, {
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
          message: "Screening not updated",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "screening.controller.info.1",
        code: error.code,
        message:
          error.message || "Some error occurred while updating the screening",
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

// delete screening from the database.
exports.delete = (req, res) => {
  // get req params
  const id = req.params.id;

  // Delete the specific screening in db
  Screening.destroy({
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
          message: "ScreeningId invalid",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "screening.controller.delete.1",
        code: error.code,
        message:
          error.message || "Some error occurred while deleting the screening",
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
