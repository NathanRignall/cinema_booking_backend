// router
var router = require("express").Router();

// controllers
const screen = require("../controllers/screen.controller.js");

// middleware
var auth = require("../middleware/auth.middleware");

// list all screens
router.get("/", auth.simple(), screen.list);

// info on screen
router.get("/:id", auth.simple(), screen.info);

// create a screen
router.post("/", auth.simple(), screen.create);

// update screen
router.put("/:id", auth.simple(), screen.edit);

// delete screen
router.delete("/:id", auth.simple(), screen.delete);

// export the router
module.exports = router;