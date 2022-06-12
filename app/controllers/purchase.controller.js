// load the dependancies
const crypto = require("crypto");
const { type } = require("express/lib/response");
const validator = require("validator");
const stripe = require('stripe')(process.env.STRIPE_LOCAL_API_KEY);
const db = require("../models");

const Purchase = db.purchases;
const Reservation = db.reservations;
const Screening = db.screenings;
const Seat = db.seats;
const Type = db.types;
const Profile = db.profiles;

const YOUR_DOMAIN = 'http://localhost:3000'

// get specific purchase from database
exports.info = (req, res) => {
  // get req params
  const id = req.params.id;

  // Find the specific movie in db
  Purchase.findByPk(id)
    .then((purchase_data) => {
      if (purchase_data) {

        // Find the specific movie in db
        Screening.findAll({
          attributes: [],
          include: [{
            model: Seat,
            through: {
              where: { purchaseId: id },
            },
            include: [{
              model: Type,
              as: "type",
            }],
          }],
        })
          .then((seat_data) => {
            if (seat_data) {
              // retun the correct vars
              res.status(200).json({
                payload: {
                  seats: seat_data,
                  purchase: purchase_data,
                },
                message: "okay",
                reqid: res.locals.reqid,
              });
            } else {
              // retun the correct vars
              res.status(400).json({
                message: "Purchase not found",
                reqid: res.locals.reqid,
              });
            }
          })
          .catch((error) => {
            // push the error to buffer
            res.locals.errors.push({
              location: "purchase.controller.info.1",
              code: error.code,
              message: error.message || "Some error occurred while finding the purchase",
              from: "sequelize",
            });

            // return the correct vars
            res.status(500).json({
              message: "Server error",
              errors: res.locals.errors,
              reqid: res.locals.reqid,
            });
          });

      } else {
        // retun the correct vars
        res.status(400).json({
          message: "Purchase not found",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "purchase.controller.info.1",
        code: error.code,
        message: error.message || "Some error occurred while finding the purchase",
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
  const screeningId = json.screeningId;
  const basket = json.basket;

  // check if screeningId is present
  if (!screeningId) {
    // retun the correct vars
    return res.status(400).json({
      message: "ScreeningId input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if basket is present
  if (!basket) {
    // retun the correct vars
    return res.status(400).json({
      message: "Basket input value missing",
      reqid: res.locals.reqid,
    });
  }

  // server side generated
  const seats = [];

  // calculate the total
  // get all the profiles
  Profile.findAll()
    .then((profile_data) => {

      let requests = basket.map((item) => {
        return new Promise((resolve, reject) => {

          if (item.seatId == null | item.profileId == null) {
            reject("Missing seat id or profile id")
          }

          Seat.findByPk(item.seatId, { include: ["type"] }).then((response) => {
            if (response) {

              let responseData = response.toJSON();

              const index = profile_data.findIndex(data => data.id == item.profileId);

              if (index < 0) {
                reject("Porfile not found")
              }

              // find the profile and calculate cost
              const cost = responseData.type.price * profile_data[index].price / 100

              seats.push({
                price: Math.round(cost),
                name: responseData.name,
                type: responseData.type.name,
                profile: profile_data[index].name,
                seatId: item.seatId,
                profileId: item.profileId,
              })

              resolve(responseData);
            } else {
              // retun the correct vars
              reject("seat not found");
            }
          })
            .catch((error) => {
              reject(error);
            });
        });
      });

      Promise.all(requests)
        .then(async () => {
          const purchaseId = crypto.randomUUID();

          let total = 0;
          seats.map((mix) => { console.log(mix); total = total + mix.price });

          // create purchase object
          const purchase = {
            id: purchaseId,
            paid: false,
            cost: total,
          };

          const t = await db.sequelize.transaction();

          Purchase.create(purchase, { transaction: t })
            .then((data) => {
              let requests = seats.map((seat) => {
                return new Promise((resolve, reject) => {
                  let reservation = {
                    id: crypto.randomUUID(),
                    screeningId: screeningId,
                    purchaseId: purchaseId,

                    seatId: seat.seatId,
                    profileId: seat.profileId,
                    price: seat.price,
                    name: seat.name,
                    type: seat.type,
                    profile: seat.profile
                  };

                  if (reservation.seatId == null | reservation.profileId == null) {
                    reject("missing")
                  }

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
                      line_items: seats.map((seat) => {
                        return {
                          price_data: {
                            currency: 'gbp',
                            product_data: {
                              name: `Seat ${seat.name} ${seat.type} ${seat.profile}`,
                            },
                            unit_amount: seat.price
                          },
                          quantity: 1,
                        }
                      }),
                      mode: 'payment',
                      customer_email: req.session.user.email,
                      success_url: `${YOUR_DOMAIN}/book/${screeningId}`,
                      cancel_url: `${YOUR_DOMAIN}/book/${screeningId}`,

                    }).then(session => {

                      // return the correct vars
                      res.status(200).json({
                        payload: {
                          sessionId: session.id,
                          purchase: data
                        },
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


        })

    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "profile.controller.create.1",
        code: error.code,
        message:
          error.message || "Some error occurred while finding the type",
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