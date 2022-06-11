// router
const router = require("express").Router();

// controllers
const profile = require("../controllers/profile.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// list all profiles
router.get("/", auth.user(), profile.list);

// export the router
module.exports = router;