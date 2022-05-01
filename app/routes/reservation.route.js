// router
var router = require("express").Router();

// controllers
const reservation = require("../controllers/reservation.controller.js");

// middleware
var auth = require("../middleware/auth.middleware");

// list all reservations
router.get("/", auth.simple(), reservation.list);

// info on reservation
router.get("/:id", auth.simple(), reservation.info);

// create a reservation
router.post("/", auth.simple(), reservation.create);

// update reservation
router.put("/:id", auth.simple(), reservation.edit);

// delete reservation
router.delete("/:id", auth.simple(), reservation.delete);

// export the router
module.exports = router;