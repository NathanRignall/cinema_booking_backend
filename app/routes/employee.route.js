// router
const router = require("express").Router();

// controllers
const employee = require("../controllers/employee.controller.js");

// middleware
const auth = require("../middleware/auth.middleware");

// register employee
router.post("/register", employee.register);

// login employee
router.post("/", employee.login);

// get employee info
router.get("/", auth.employee(), employee.info); // view

// logged in employee update
router.put("/", auth.employee(), employee.update); // view

// reset password of current employee
router.put("/password", auth.employee(), employee.password);

// logout sesison
router.get("/logout", auth.employee(), employee.logout);

// export the router
module.exports = router;