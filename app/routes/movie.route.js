// router
const router = require("express").Router();

// controllers
const movie = require("../controllers/movie.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// list all movies
router.get("/", movie.list);

// info on movie
router.get("/:id", movie.info);

// export the router
module.exports = router;