// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const db = require("../models");

// load the db
const Movie = db.movies;

// get all movies from the database.
exports.list = (req, res) => {
  Movie.findAll()
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
        location: "movie.controller.list.1",
        code: error.code,
        message:
          error.message || "Some error occurred while finding the movies",
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

// search movie from the database.
exports.find = (req, res) => {
  // set req parms
  const find = req.query.find;

  // find the movie in db
  Movie.findAll({
    where: {
      title: {
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
        location: "movie.controller.find.1",
        code: error.code,
        message:
          error.message || "Some error occurred while finding the movies",
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

// get specific movie from the database.
exports.info = (req, res) => {
    // get req params
    const id = req.params.id;

    // Find the specific movie in db
    Movie.findByPk(id, { include: ["screenings"] })
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
                    message: "Movie not found",
                    reqid: res.locals.reqid,
                });
            }
        })
        .catch((error) => {
            // push the error to buffer
            res.locals.errors.push({
                location: "movie.controller.info.1",
                code: error.code,
                message: error.message || "Some error occurred while finding the movie",
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

// create a movie in the database.
exports.create = function (req, res, next) {
  // get the info from json
  const json = req.body;

  // set the vars from post
  const title = json.title;
  const description = json.description;
  const duration = json.duration;

  // check if title is present
  if (!title) {
    // retun the correct vars
    return res.status(400).json({
      message: "Title input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if description is present
  if (!description) {
    // retun the correct vars
    return res.status(400).json({
      message: "Description input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if description is present
  if (!duration) {
    // retun the correct vars
    return res.status(400).json({
      message: "Duration input value missing",
      reqid: res.locals.reqid,
    });
  }

  // create uuid
  const id = crypto.randomUUID();

  // create movie object
  const movie = {
    id: id,
    title: title,
    description: description,
    duration: duration,
  };

  // Create movie in the database
  Movie.create(movie)
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
        location: "movie.controller.create.1",
        code: error.code,
        message:
          error.message || "Some error occurred while creating the movie.",
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

// update movie from the database.
exports.edit = (req, res) => {
  // get req params
  const id = req.params.id;

  // get the info from json
  const json = req.body;

  // set the vars from post
  const title = json.title;
  const description = json.description;
  const duration = json.duration;

  // check if title is present
  if (!title) {
    // retun the correct vars
    return res.status(400).json({
      message: "Title input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if description is present
  if (!description) {
    // retun the correct vars
    return res.status(400).json({
      message: "Description input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if description is present
  if (!duration) {
    // retun the correct vars
    return res.status(400).json({
      message: "Duration input value missing",
      reqid: res.locals.reqid,
    });
  }

  // create movie object
  const movie = {
    title: title,
    description: description,
    duration: duration,
  };

  // Update the specific movie in the db
  Movie.update(movie, {
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
          message: "Movie not updated",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "movie.controller.info.1",
        code: error.code,
        message: error.message || "Some error occurred while updating the movie",
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

// delete movie from the database.
exports.delete = (req, res) => {
  // get req params
  const id = req.params.id;

  // Delete the specific movie in db
  Movie.destroy({
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
          message: "MovieId invalid",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "movie.controller.delete.1",
        code: error.code,
        message:
          error.message || "Some error occurred while deleting the movie",
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
