// router
const router = require("express").Router();

// controllers
const stats = require("../controllers/admin.stats.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// list
router.get("/", auth.employee(), stats.list);

// test
router.get("/:id", auth.employee(), stats.test);

// export the router
module.exports = router;