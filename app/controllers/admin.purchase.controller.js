// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const db = require("../models");

const Purchase = db.purchases;
const Reservation = db.reservations;
const Screening = db.screenings;
const Seat = db.seats;
const Type = db.types;
const Profile = db.profiles;

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
        location: "admin.purchase.controller.list.1",
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
exports.force = async function (req, res, next) {
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
              location: "admin.purchase.controller.force.1",
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
          location: "admin.purchase.controller.force.2",
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
            paid: true,
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
                      location: "admin.purchase.controller.create.3",
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
        location: "admin.purchase.controller.create.1",
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