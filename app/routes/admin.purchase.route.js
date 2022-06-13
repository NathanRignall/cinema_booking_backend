// router
const router = require("express").Router();

// controllers
const purchase = require("../controllers/admin.purchase.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// list all purchases
router.get("/", auth.employee(), purchase.list);

// list all purchases
router.get("/:id", auth.employee(), purchase.info);

// create a purchase
router.post("/", auth.employee(), purchase.create);

// force a purchase
router.post("/force", auth.employee(), purchase.force);

// export the router
module.exports = router;