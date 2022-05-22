// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const db = require("../models");

const Purchase = db.purchases;
const Reservation = db.reservations;
const Seat = db.seats;

// get all purchases from the database.
exports.list = (req, res) => {
  Purchase.findAll({ include: ["screening", Seat] })
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
        location: "purchase.controller.list.1",
        code: error.code,
        message:
          error.message || "Some error occurred while finding the purchases",
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

// create a purchase in the database.
exports.create = async function (req, res, next) {
  // get the info from json
  const json = req.body;

  // set the vars from post
  const paid = json.paid;
  const screeningId = json.screeningId;
  const seats = json.seats;

  // check if paid is present
  if (!paid) {
    // retun the correct vars
    return res.status(400).json({
      message: "Paid input value missing",
      reqid: res.locals.reqid,
    });
  }

  const id = crypto.randomUUID();

  // create purchase object
  const purchase = {
    id: id,
    paid: paid,
    cost: 0,
  };

  const t = await db.sequelize.transaction();

  Purchase.create(purchase, { transaction: t })
    .then((data) => {
      let requests = seats.map((seat) => {
        return new Promise((resolve, reject) => {
          let reservation = {
            id: crypto.randomUUID(),
            seatId: seat.id,
            screeningId: screeningId,
            purchaseId: id,
            ticketId: seat.ticketId,
          };

          Reservation.create(reservation, { transaction: t })
            .then((response) => {
              resolve(response);
            })
            .catch((response) => {
              reject(response);
            });
        });
      });

      Promise.all(requests)
        .then(() => {
          // try commit to the db
          t.commit().then(() => {
            // return the correct vars
            res.status(200).json({
              payload: data,
              message: "okay",
              reqid: res.locals.reqid,
            });
          });
        })
        .catch((error) => {
          t.rollback().then(() => {
            // push the error to buffer
            res.locals.errors.push({
              location: "purchase.controller.create.1",
              code: error.code,
              message:
                error.message ||
                "Some error occurred while reserving the seats",
              from: "sequelize",
            });

            if (error.name == "SequelizeUniqueConstraintError") {
              // return the correct vars
              res.status(400).json({
                message: "Seat already booked",
                errors: res.locals.errors,
                reqid: res.locals.reqid,
              });
            } else {
              // return the correct vars
              res.status(500).json({
                message: "Server error",
                errors: res.locals.errors,
                reqid: res.locals.reqid,
              });
            }
          });
        });
    })
    .catch((error) => {
      t.rollback().then(() => {
        // push the error to buffer
        res.locals.errors.push({
          location: "purchase.controller.create.2",
          code: error.code,
          message:
            error.message || "Some error occurred while creating the purchase",
          from: "sequelize",
        });

        // return the correct vars
        res.status(500).json({
          message: "Server error",
          errors: res.locals.errors,
          reqid: res.locals.reqid,
        });
      });
    });
};
