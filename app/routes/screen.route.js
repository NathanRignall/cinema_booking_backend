// router
var router = require("express").Router();

// controllers
const screen = require("../controllers/screen.controller.js");

// middleware
var auth = require("../middleware/auth.middleware");

// list all screens
router.get("/", auth.employee(), screen.list);

// find screen
router.get("/find", auth.employee(), screen.find);

// info on screen
router.get("/:id", auth.employee(), screen.info);

// create a screen
router.post("/", auth.employee(), screen.create);

// update screen
router.put("/:id", auth.employee(), screen.edit);

// delete screen
router.delete("/:id", auth.employee(), screen.delete);

// export the router
module.exports = router;