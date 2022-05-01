
// router
const router = require("express").Router();

// controllers
const session = require("../controllers/session.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// register user
router.post("/register", session.register);

// login users
router.post("/", session.login);

// session user info
router.get("/", auth.simple(), session.info); // view

// logged in user update
router.put("/", auth.simple(), session.update); // view

// reset password of current user
router.put("/password", auth.simple(), session.password);

// logout sesison
router.put("/logout", auth.simple(), session.logout);

// export the router
module.exports = router;