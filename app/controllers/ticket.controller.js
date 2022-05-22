// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const db = require("../models");

// load the db
const Ticket = db.tickets;

// get all tickets from the database.
exports.list = (req, res) => {
  Ticket.findAll()
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
        location: "ticket.controller.list.1",
        code: error.code,
        message: error.message || "Some error occurred while finding the tickets",
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

// create a ticket in the database.
exports.create = function (req, res, next) {
    // get the info from json
    const json = req.body;
  
    // set the vars from post
    const name = json.name;
    const price = json.price;
  
    // check if name is present
    if (!name) {
      // retun the correct vars
      return res.status(400).json({
        message: "Name input value missing",
        reqid: res.locals.reqid,
      });
    }

    // check if price is present
    if (!price) {
      // retun the correct vars
      return res.status(400).json({
        message: "Price input value missing",
        reqid: res.locals.reqid,
      });
    }
  
    // create uuid
    const id = crypto.randomUUID();
  
    // create ticket object
    const ticket = {
      id: id,
      name: name,
      price: price,
    };
  
    // Create ticket in the database
    Ticket.create(ticket)
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
          location: "ticket.controller.create.1",
          code: error.code,
          message:
            error.message || "Some error occurred while creating the ticket.",
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