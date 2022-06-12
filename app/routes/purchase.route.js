// router
const router = require("express").Router();

// controllers
const purchase = require("../controllers/purchase.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// info on purchase
router.get("/:id", auth.user(), purchase.info);

// create purchase
router.post("/", auth.user(), purchase.create);

// export the router
module.exports = router;