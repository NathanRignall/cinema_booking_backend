// router
const router = require("express").Router();

// controllers
const ticket = require("../controllers/ticket.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// list all tickets
router.get("/", auth.employee(), ticket.list);

// create a ticket
router.post("/", auth.employee(), ticket.create);

// export the router
module.exports = router;