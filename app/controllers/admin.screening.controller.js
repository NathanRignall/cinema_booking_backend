// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const db = require("../models");

// load the db
const Screening = db.screenings;
const Screen = db.screens;
const Seat = db.seats;
const Movie = db.movies;
const Type = db.types;

// get all screenings from the database.
exports.list = (req, res) => {
  // set req params
  const start = new Date(req.query.start);
  const end = new Date(req.query.end);

  Screening.findAll({
    include: ["screen", "movie"],
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
        location: "admin.screening.controller.list.1",
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

// search screening from the database.
exports.find = (req, res) => {
  // set req parms
  const screen = req.query.screen;
  const movie = req.query.movie;

  const pastDate = new Date(req.query.date);
  pastDate.setHours(0, 0, 0, 0);
  const futureDate = new Date(req.query.date);
  futureDate.setHours(24, 0, 0, 0);

  var command = {};

  if (screen) {
    command = {
      include: [
        {
          model: Movie,
          as: "movie",
        },
        {
          model: Screen,
          as: "screen",
          where: {
            id: {
              [db.Sequelize.Op.like]: screen,
            },
          },
        },
      ],
      where: {
        time: {
          [db.Sequelize.Op.between]: [pastDate, futureDate],
        },
      },
    };
  } else if (movie) {
    command = {
      include: [
        {
          model: Movie,
          as: "movie",
          where: {
            id: {
              [db.Sequelize.Op.like]: movie,
            },
          },
        },
        {
          model: Screen,
          as: "screen",
        },
      ],
      where: {
        time: {
          [db.Sequelize.Op.between]: [pastDate, futureDate],
        },
      },
    };
  } else {
    command = {
      include: [
        {
          model: Movie,
          as: "movie",
        },
        {
          model: Screen,
          as: "screen",
        },
      ],
      where: {
        time: {
          [db.Sequelize.Op.between]: [pastDate, futureDate],
        },
      },
    };
  }

  // find the screening in db
  Screening.findAll(command)
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
        location: "admin.screening.controller.find.1",
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

// get stats about screenings
exports.stats = (req, res) => {
  // set req parms
  const screenId = req.query.screenId;
  const movieId = req.query.movieId;
  const occupied = req.query.occupied;

  // get the config to use with the query
  const config = {
    include: [
      occupied
        ? {
            model: Seat,
            as: "seats",
            attributes: [],
          }
        : {
            model: Screen,
            as: "screen",
            attributes: [],
            include: occupied
              ? []
              : [
                  {
                    model: Seat,
                    as: "seats",
                    attributes: [],
                  },
                ],
          },
      screenId
        ? {
            model: Screen,
            as: "screen",
            attributes: ["name"],
            where: {
              id: screenId,
            },
          }
        : {
            model: Screen,
            as: "screen",
            attributes: [],
          },
      movieId
        ? {
            model: Movie,
            as: "movie",
            attributes: ["title"],
            where: {
              id: movieId,
            },
          }
        : {
            model: Screen,
            as: "screen",
            attributes: [],
          },
    ],
    attributes: [
      occupied
        ? [
            db.Sequelize.fn("COUNT", db.Sequelize.col("seats.id")),
            "occupiedSeats",
          ]
        : [
            db.Sequelize.fn("COUNT", db.Sequelize.col("screen.seats.id")),
            "totalSeats",
          ],
      [db.Sequelize.fn("DATE", db.Sequelize.col("time")), "date"],
    ],
    group: [
      [db.Sequelize.fn("DATE", db.Sequelize.col("time")), "date"],
      screenId ? "screen.id" : movieId ? "movie.id" : "date",
    ],
    options: { omitNull: true },
  };

  // find occupied seats in the db
  Screening.findAll(config)
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
        location: "admin.screening.controller.stats.1",
        code: error.code,
        message: error.message || "Some error occurred while finding the stats",
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
        location: "admin.screening.controller.info.1",
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
        location: "admin.screening.controller.create.1",
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
        location: "admin.screening.controller.info.1",
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
        location: "admin.screening.controller.delete.1",
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
