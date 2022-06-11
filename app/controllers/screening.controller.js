// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const db = require("../models");

// load the db
const Screening = db.screenings;
const Screen = db.screens;
const Seat = db.seats;
const Type = db.types;
const Movie = db.movies;

// get all screenings from the database.
exports.list = (req, res) => {

  // set req params
  const start = new Date(req.query.start);
  const end = new Date(req.query.end);
  const movieId = req.query.movieId;

  Screening.findAll({
    include: ["screen", {
      model: Movie,
      as: "movie",
      where: {
        id: {
          [db.Sequelize.Op.like]: movieId,
        },
      },
    }
    ],
    order: [["time", "ASC"]],
    where: {
      time: {
        [db.Sequelize.Op.between]: [start, end],
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
        });

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