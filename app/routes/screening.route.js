// router
const router = require("express").Router();

// controllers
const screening = require("../controllers/screening.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// list all screenings
router.get("/", screening.list);

// info on screening
router.get("/:id", auth.both(), screening.info);

// export the router
module.exports = router;