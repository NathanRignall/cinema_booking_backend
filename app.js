// import express packages
const express = require("express");
const session = require("express-session");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// import custom packages
const cors = require("cors");
const crypto = require("crypto");

// setup the sequalize
const db = require("./app/models");
db.sequelize.sync();

// init the app
const app = express();

// import the user routes
const sessionRouter = require("./app/routes/session.route");
const movieRouter = require("./app/routes/movie.route");
const profileRouter = require("./app/routes/profile.route");
const purchaseRouter = require("./app/routes/purchase.route");
const screeningRouter = require("./app/routes/screening.route");

// import the admin routes
const adminSessionRouter = require("./app/routes/admin.session.route");
const adminMovieRouter = require("./app/routes/admin.movie.route");
const adminProfileRouter = require("./app/routes/admin.profile.route");
const adminPurchaseRouter = require("./app/routes/admin.purchase.route");
const adminScreenRouter = require("./app/routes/admin.screen.route");
const adminScreeningRouter = require("./app/routes/admin.screening.route");
const adminSeatRouter = require("./app/routes/admin.seat.route");
const adminTypeRouter = require("./app/routes/admin.type.route");

// import the hook routes
const hookStripeRouter = require("./app/routes/hook.stripe.route");

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

// use the user routes
app.use("/session", express.json(), sessionRouter);
app.use("/movie", express.json(), movieRouter);
app.use("/profile", express.json(), profileRouter);
app.use("/purchase", express.json(), purchaseRouter);
app.use("/screening", express.json(), screeningRouter);

// use the admin routes
app.use("/admin/session", express.json(), adminSessionRouter);
app.use("/admin/movie", express.json(), adminMovieRouter);
app.use("/admin/profile", express.json(), adminProfileRouter);
app.use("/admin/purchase", express.json(), adminPurchaseRouter);
app.use("/admin/screen", express.json(), adminScreenRouter);
app.use("/admin/screening", express.json(), adminScreeningRouter);
app.use("/admin/seat", express.json(), adminSeatRouter);
app.use("/admin/type", express.json(), adminTypeRouter);

// use hook routes
app.use("/hook/stripe", bodyParser.raw({ type: "*/*" }), hookStripeRouter);

module.exports = app;
