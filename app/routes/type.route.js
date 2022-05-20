// router
var router = require("express").Router();

// controllers
const type = require("../controllers/type.controller.js");

// middleware
var auth = require("../middleware/auth.middleware");

// list all types
router.get("/", auth.employee(), type.list);

// create a type
router.post("/", auth.employee(), type.create);

// export the router
module.exports = router;