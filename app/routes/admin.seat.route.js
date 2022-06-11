// router
const router = require("express").Router();

// controllers
const seat = require("../controllers/admin.seat.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// delete seat
router.delete("/:id", auth.employee(), seat.delete);

// bulk create seats
router.post("/bulk", auth.employee(), seat.bulkCreate);

// bulk create seats
router.put("/bulk", auth.employee(), seat.bulkEdit);

// bulk create seats
router.post("/bulk/delete", auth.employee(), seat.bulkDelete);

// export the router
module.exports = router;