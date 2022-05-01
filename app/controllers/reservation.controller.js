// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const db = require("../models");

// load the db
const Reservation = db.reservations;

// get all reservations from the database.
exports.list = (req, res) => {
  Reservation.findAll()
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
        location: "reservation.controller.list.1",
        code: error.code,
        message:
          error.message || "Some error occurred while finding the reservations",
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

// get specific reservation from the database.
exports.info = (req, res) => {
  // get req params
  const id = req.params.id;

  // Find the specific reservation in db
  Reservation.findByPk(id, { include: ["screening", db.seats] })
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
          message: "Reservation not found",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "reservation.controller.info.1",
        code: error.code,
        message:
          error.message || "Some error occurred while finding the reservation",
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

// create a reservation in the database.
exports.create = function (req, res, next) {
  // get the info from json
  const json = req.body;

  // set the vars from post
  const paid = json.paid;
  const screeningId = json.screeningId;
  const seatId = json.seatId;

  // check if paid is present
  if (!paid) {
    // retun the correct vars
    return res.status(400).json({
      message: "Paid input value missing",
      reqid: res.locals.reqid,
    });
  }

  // create uuid
  const id = crypto.randomUUID();

  // create reservation object
  const reservation = {
    id: id,
    paid: paid,
    screeningId: screeningId,
    seatId: seatId
  };

  // Create reservation in the database
  Reservation.create(reservation)
    .then((data) => {

      // then create the relation ship between them
      db.seat_reservations.create( { reservationId: id, seatId: seatId});

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
        location: "reservation.controller.create.1",
        code: error.code,
        message:
          error.message || "Some error occurred while creating the reservation",
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

// update reservation from the database.
exports.edit = (req, res) => {
  // get req params
  const id = req.params.id;

  // get the info from json
  const json = req.body;

  // set the vars from post
  const paid = json.paid;

  // check if title is present
  if (!paid) {
    // retun the correct vars
    return res.status(400).json({
      message: "Paid input value missing",
      reqid: res.locals.reqid,
    });
  }

  // create reservation object
  const reservation = {
    paid: paid,
  };

  // Update the specific reservation in the db
  Reservation.update(reservation, {
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
          message: "Reservation not updated",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "reservation.controller.info.1",
        code: error.code,
        message:
          error.message || "Some error occurred while updating the reservation",
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

// delete reservation from the database.
exports.delete = (req, res) => {
  // get req params
  const id = req.params.id;

  // Delete the specific reservation in db
  Reservation.destroy({
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
          message: "ReservationId invalid",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "reservation.controller.delete.1",
        code: error.code,
        message:
          error.message || "Some error occurred while deleting the reservation",
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
