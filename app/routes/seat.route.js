// router
var router = require("express").Router();

// controllers
const seat = require("../controllers/seat.controller.js");

// middleware
var auth = require("../middleware/auth.middleware");

// delete seat
router.delete("/:id", auth.employee(), seat.delete);

// bulk create seats
router.post("/bulk", auth.employee(), seat.bulkCreate);

// bulk create seats
router.put("/bulk", auth.employee(), seat.bulkEdit);

// export the router
module.exports = router;