// router
const router = require("express").Router();

// controllers
const purchase = require("../controllers/purchase.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// create purchase
router.post("/", auth.user(), purchase.create);

// export the router
module.exports = router;