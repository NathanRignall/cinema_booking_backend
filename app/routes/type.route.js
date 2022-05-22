// router
const router = require("express").Router();

// controllers
const type = require("../controllers/type.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// list all types
router.get("/", auth.employee(), type.list);

// find type
router.get("/find", auth.employee(), type.find);

// create a type
router.post("/", auth.employee(), type.create);

// delete type
router.delete("/:id", auth.employee(), type.delete);

// export the router
module.exports = router;