// router
var router = require("express").Router();

// controllers
const reservation = require("../controllers/reservation.controller.js");

// middleware
var auth = require("../middleware/auth.middleware");

// list all reservations
router.get("/", auth.employee(), reservation.list);

// info on reservation
router.get("/:id", auth.employee(), reservation.info);

// create a reservation
router.post("/", auth.employee(), reservation.create);

// update reservation
router.put("/:id", auth.employee(), reservation.edit);

// delete reservation
router.delete("/:id", auth.employee(), reservation.delete);

// export the router
module.exports = router;