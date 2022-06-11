// router
const router = require("express").Router();

// controllers
const movie = require("../controllers/movie.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// list all movies
router.get("/", movie.list);

// find movie
router.get("/find", movie.find);

// info on movie
router.get("/:id", movie.info);

// create a movie
router.post("/", auth.employee(), movie.create);

// update movie
router.put("/:id", auth.employee(), movie.edit);

// delete movie
router.delete("/:id", auth.employee(), movie.delete);

// export the router
module.exports = router;