// router
const router = require("express").Router();

// controllers
const purchase = require("../controllers/purchase.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// list all purchases
router.get("/", auth.employee(), purchase.list);

// create a purchase
router.post("/", auth.employee(), purchase.create);

// export the router
module.exports = router;