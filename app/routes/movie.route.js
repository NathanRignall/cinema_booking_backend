// router
const router = require("express").Router();

// controllers
const movie = require("../controllers/movie.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// list all movies
router.get("/", auth.employee(), movie.list);

// find movie
router.get("/find", auth.employee(), movie.find);

// info on movie
router.get("/:id", auth.employee(), movie.info);

// create a movie
router.post("/", auth.employee(), movie.create);

// update movie
router.put("/:id", auth.employee(), movie.edit);

// delete movie
router.delete("/:id", auth.employee(), movie.delete);

// export the router
module.exports = router;