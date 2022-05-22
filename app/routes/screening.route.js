// router
const router = require("express").Router();

// controllers
const screening = require("../controllers/screening.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// list all screenings
router.get("/", auth.employee(), screening.list);

// info on screening
router.get("/:id", auth.employee(), screening.info);

// create a screening
router.post("/", auth.employee(), screening.create);

// update screening
router.put("/:id", auth.employee(), screening.edit);

// delete screening
router.delete("/:id", auth.employee(), screening.delete);

// export the router
module.exports = router;