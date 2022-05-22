// router
const router = require("express").Router();

// controllers
const session = require("../controllers/session.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// register user
router.post("/register", session.register);

// login user
router.post("/", session.login);

// get user info
router.get("/", auth.user(), session.info); // view

// logged in user update
router.put("/", auth.user(), session.update); // view

// reset password of current user
router.put("/password", auth.user(), session.password);

// logout sesison
router.put("/logout", auth.user(), session.logout);

// export the router
module.exports = router;