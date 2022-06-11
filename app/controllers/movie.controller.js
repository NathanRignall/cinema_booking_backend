// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const db = require("../models");

// load the db
const Movie = db.movies;
const Screening = db.screenings;

// search movie from the database.
exports.list = (req, res) => {
  // set req parms
  const title = req.query.title;
  const start = new Date(req.query.start);
  const end = new Date(req.query.end);

  let query = { order: [["updatedAt", "DESC"]] };

  if (title) {
    query = {
      where: {
        title: {
          [db.Sequelize.Op.like]: `%${title}%`,
        },
      },
    }
  }

  if (start & end) {
    query = {
      include: [
        {
          model: Screening,
          as: "screenings",
          attributes: [],
          where: {
            time: {
              [db.Sequelize.Op.between]: [start, end],
            },
          },
        }],
      order: [["updatedAt", "DESC"]],
      group: "id",
    }
  }

  // find the movie in db
  Movie.findAll(query)
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