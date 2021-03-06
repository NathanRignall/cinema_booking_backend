// load the dependancies
const crypto = require("crypto");
const validator = require("validator");
const db = require("../models");

// load the db
const Seat = db.seats;

function intToChar(int) {
  const code = "A".charCodeAt(0);

  return String.fromCharCode(code + int - 1);
}

// delete seat from the database.
exports.delete = (req, res) => {
  // get req params
  const id = req.params.id;

  // Delete the specific seat in db
  Seat.destroy({
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
          message: "SeatId invalid",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "admin.seat.controller.delete.1",
        code: error.code,
        message: error.message || "Some error occurred while deleting the seat",
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

// bulk create seats in the database.
exports.bulkCreate = function (req, res, next) {
  // get the info from json
  const json = req.body;

  // set the vars from post
  const screenId = json.screenId;
  const typeId = json.typeId;
  const rows = json.rows;
  const columns = json.columns;

  // check if title is present
  if (!screenId) {
    // retun the correct vars
    return res.status(400).json({
      message: "ScreenId input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if title is present
  if (!typeId) {
    // retun the correct vars
    return res.status(400).json({
      message: "TypeId input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if rows is present
  if (!rows) {
    // retun the correct vars
    return res.status(400).json({
      message: "Rows input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if columns is present
  if (!columns) {
    // retun the correct vars
    return res.status(400).json({
      message: "Columns input value missing",
      reqid: res.locals.reqid,
    });
  }

  // bulk create seats array
  const seats = [];

  // loop through rows and columns to make seats
  for (let row_count = 0; row_count < rows; row_count++) {
    for (let column_count = 0; column_count < columns; column_count++) {
      let id = crypto.randomUUID();
      let name = intToChar(row_count + 1) + (column_count + 1).toString();

      seats.push({
        id: id,
        name: name,
        x: column_count,
        y: row_count,
        screenId: screenId,
        typeId: typeId,
      });
    }
  }

  // Create all the seats in the database
  Seat.bulkCreate(seats)
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
        location: "admin.seat.controller.bulkCreate.1",
        code: error.code,
        message:
          error.message || "Some error occurred while creating the seats.",
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
exports.bulkEdit = (req, res) => {
  // get req params
  const id = req.params.id;

  // get the info from json
  const json = req.body;

  // set the vars from post
  const seats = json.seats;

  // check if seats is present
  if (!seats) {
    // retun the correct vars
    return res.status(400).json({
      message: "Seats input value missing",
      reqid: res.locals.reqid,
    });
  }

  // set the seat name
  seats.forEach((seat, index) => {
    let name = intToChar(seat.y + 1) + (seat.x + 1).toString();
    seats[index].name = name;
  });

  // Create all the seats in the database (used for update)
  Seat.bulkCreate(seats, { updateOnDuplicate: ["name", "x", "y"] })
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
        location: "admin.seat.controller.bulkEdit.1",
        code: error.code,
        message:
          error.message || "Some error occurred while 'updating' the seats.",
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

// bulk delete seat from the database.
exports.bulkDelete = (req, res) => {
  // get req params
  const id = req.params.id;

  // get the info from json
  const json = req.body;

  // set the vars from post
  const seatIds = json.seatIds;

  // Delete the specific seat in db
  Seat.destroy({
    where: { id: seatIds },
  })
    .then((number) => {
      if (number == seatIds.length) {
        // retun the correct vars
        res.status(200).json({
          message: "okay",
          reqid: res.locals.reqid,
        });
      } else {
        // retun the correct vars
        res.status(400).json({
          message: "Some SeatIds invalid",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "admin.seat.controller.bulkDelete.1",
        code: error.code,
        message: error.message || "Some error occurred while bulk deleting the seats",
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