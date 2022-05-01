// router
var router = require("express").Router();

// controllers
const movie = require("../controllers/movie.controller.js");

// middleware
var auth = require("../middleware/auth.middleware");

// list all movies
router.get("/", auth.simple(), movie.list);

// find movie
router.get("/find", auth.simple(), movie.find);

// info on movie
router.get("/:id", auth.simple(), movie.info);

// create a movie
router.post("/", auth.simple(), movie.create);

// update movie
router.put("/:id", auth.simple(), movie.edit);

// delete movie
router.delete("/:id", auth.simple(), movie.delete);

// export the router
module.exports = router;