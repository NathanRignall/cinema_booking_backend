// import express packages
const express = require("express");
const session = require("express-session");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

// import custom packages
const cors = require("cors");
const crypto = require("crypto");

// setup the sequalize
const db = require("./app/models");
db.sequelize.sync();

// init the app
const app = express();

// import the routes
const sessionRouter = require("./app/routes/session.route");
const employeeRouter = require("./app/routes/employee.route");
const movieRouter = require("./app/routes/movie.route");
const screenRouter = require("./app/routes/screen.route");
const screeningRouter = require("./app/routes/screening.route");
const reservationRouter = require("./app/routes/reservation.route");

// setup cors middleware
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
};
app.use(cors(corsOptions));

// setup the custom middleware
app.use(function (req, res, next) {
  res.locals.errors = [];
  res.locals.reqid = crypto.randomBytes(20).toString("hex");
  next();
});

// setup standard middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// setup the session
app.use(
    session({
      name: "session",
      secret: "test",
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        path: "/",
      },
    })
  );

// use the routes
app.use("/session", sessionRouter);
app.use("/employee", employeeRouter);
app.use("/admin/movie", movieRouter);
app.use("/admin/screen", screenRouter);
app.use("/admin/screening", screeningRouter);
app.use("/admin/reservation", reservationRouter);

module.exports = app;
