// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const stripe = require('stripe')(process.env.STRIPE_LOCAL_API_KEY);
const db = require("../models");

const Purchase = db.purchases;
const Reservation = db.reservations;
const Seat = db.seats;

const YOUR_DOMAIN = 'https://cinema.nathanrignall.uk'

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

  // check if screeningId is present
  if (!screeningId) {
    // retun the correct vars
    return res.status(400).json({
      message: "ScreeningId input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if screeningId is present
  if (!seats) {
    // retun the correct vars
    return res.status(400).json({
      message: "Seats input value missing",
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
            profileId: seat.profileId,
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

            stripe.checkout.sessions.create({
              line_items: [
                {
                  // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                  price_data: {
                    currency: 'gbp',
                    product_data: {
                      name: "test",
                      images: ['https://i.imgur.com/EHyR2nP.png'],
                    },
                    unit_amount: 100
                  },
                  quantity: 1,
                },
              ],
              mode: 'payment',
              success_url: `${YOUR_DOMAIN}/success.html`,
              cancel_url: `${YOUR_DOMAIN}/cancel.html`,

            }).then(session => {

              // return the correct vars
              res.status(200).json({
                payload: session.url,
                message: "okay",
                reqid: res.locals.reqid,
              });

            }).catch(error => {

              // push the error to buffer
              res.locals.errors.push({
                location: "admin.purchase.controller.create.4",
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
        })
        .catch((error) => {
          t.rollback().then(() => {
            // push the error to buffer
            res.locals.errors.push({
              location: "admin.purchase.controller.create.1",
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
          location: "admin.purchase.controller.create.2",
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
