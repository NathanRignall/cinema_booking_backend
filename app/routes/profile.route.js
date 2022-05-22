// router
const router = require("express").Router();

// controllers
const profile = require("../controllers/profile.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// list all profiles
router.get("/", auth.employee(), profile.list);

// create a profile
router.post("/", auth.employee(), profile.create);

// delete profile
router.delete("/:id", auth.employee(), profile.delete);

// export the router
module.exports = router;