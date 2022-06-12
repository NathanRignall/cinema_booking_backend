// router
const router = require("express").Router();

// controllers
const stripe = require("../controllers/hook.stripe.controller.js");

// actual routes
router.post('/completed', stripe.completed);

// export the router
module.exports = router;