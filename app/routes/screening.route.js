// router
var router = require("express").Router();

// controllers
const screening = require("../controllers/screening.controller.js");

// middleware
var auth = require("../middleware/auth.middleware");

// list all screenings
router.get("/", auth.simple(), screening.list);

// info on screening
router.get("/:id", auth.simple(), screening.info);

// create a screening
router.post("/", auth.simple(), screening.create);

// update screening
router.put("/:id", auth.simple(), screening.edit);

// delete screening
router.delete("/:id", auth.simple(), screening.delete);

// export the router
module.exports = router;