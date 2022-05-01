// load the dependancies
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const validator = require("validator");

// load the db
const db = require("../models");
const Employee = db.employees;

// register an employee on system (TEMPOARY)
exports.register = function (req, res, next) {
  // get the info from json
  const json = req.body;

  // set the vars from post
  const email = json.email;
  const firstName = json.firstName;
  const lastName = json.lastName;
  const password = json.password;

  // check if email is present
  if (!email) {
    // retun the correct vars
    return res.status(400).json({
      message: "Email input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if email is an email
  if (!validator.isEmail(email)) {
    // retun the correct vars
    return res.status(400).json({
      message: "Email provided is not an email address",
      reqid: res.locals.reqid,
    });
  }

  // check if first name is present
  if (!firstName) {
    // retun the correct vars
    return res.status(400).json({
      message: "First name input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if last name is present
  if (!lastName) {
    // retun the correct vars
    return res.status(400).json({
      message: "Last name input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if password is present
  if (!password) {
    // retun the correct vars
    return res.status(400).json({
      message: "Password input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if password is secure
  if (!validator.isStrongPassword(password, { minSymbols: 0 })) {
    // retun the correct vars
    return res.status(400).json({
      message: "Password provided is not secure enough",
      reqid: res.locals.reqid,
    });
  }

  // hash the password
  const hash = bcrypt.hashSync(password, 10);

  // create uuid
  const id = crypto.randomUUID();

  // create employee object
  const employee = {
    id: id,
    email: email,
    firstName: firstName,
    lastName: lastName,
    hash: hash,
  };

  // Create employee in the database
  Employee.create(employee)
    .then((data) => {
      // destroy the exisitng session to avoid confusion
      req.session.destroy();
      
      // login the employee by storing data to session
      req.session.employee = {
        id: data.id,
        email: data.email,
        firstName: firstName,
        lastName: lastName,
      };

      // retun the correct vars
      res.status(200).json({
        payload: req.session.employee,
        message: "okay",
        reqid: res.locals.reqid,
      });
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "employee.controller.register.1",
        code: error.code,
        message: error.message || "Some error occurred while creating the employee",
        from: "sequelize",
      });

      // return the correct vars
      res.status(500).json({
        message: "Server error",
        errors: res.locals.errors,
        reqid: res.locals.reqid,
      });
    });
};

// login to system
exports.login = function (req, res, next) {
  // get the info from json
  const json = req.body;

  // set the vars from post
  const email = json.email;
  const password = json.password;

  // check if email is present
  if (!email) {
    // retun the correct vars
    return res.status(400).json({
      message: "Email input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if password is present
  if (!password) {
    // retun the correct vars
    return res.status(400).json({
      message: "Password input value missing",
      reqid: res.locals.reqid,
    });
  }

  Employee.findOne({
    where: {
      email: email,
    },
  })
    .then((data) => {
      // check if the employee exists
      if (data != null) {
        // store the hash to var
        const hash = data.hash;

        // check the password matches hash
        if (bcrypt.compareSync(password, hash)) {
          // destroy the exisitng session to avoid confusion
          req.session.destroy();

          // login the employee by storing data to session
          req.session.employee = {
            id: data.id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
          };

          // retun the correct vars
          res.status(200).json({
            payload: req.session.employee,
            message: "okay",
            reqid: res.locals.reqid,
          });
        } else {
          // retun the correct vars
          res.status(401).json({
            message: "Incorrect Password",
            reqid: res.locals.reqid,
          });
        }
      } else {
        // retun the correct vars
        res.status(401).json({
          message: "Employee does not exist",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "employee.controller.login.1",
        code: error.code,
        message: error.message || "Some error occurred while finding the employee",
        from: "sequelize",
      });

      // return the correct vars
      res.status(500).json({
        message: "Server error",
        errors: res.locals.errors,
        reqid: res.locals.reqid,
      });
    });
};

// get info on current logged in employee
exports.info = function (req, res, next) {
  // return the correct vars
  res.status(200).json({
    payload: req.session.employee,
    message: "okay",
    reqid: res.locals.reqid,
  });
};

// update logged in employee info
exports.update = function (req, res, next) {
  // get the employee id from session
  const id = req.session.employee.id;

  // get the info from json
  const json = req.body;

  // set the vars from post
  const email = json.email;
  const firstName = json.firstName;
  const lastName = json.lastName;

  // check if email is present
  if (!email) {
    // retun the correct vars
    return res.status(400).json({
      message: "Email input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if email is an email
  if (!validator.isEmail(email)) {
    // retun the correct vars
    return res.status(400).json({
      message: "Email provided is not an email address",
      reqid: res.locals.reqid,
    });
  }

  // check if first name is present
  if (!firstName) {
    // retun the correct vars
    return res.status(400).json({
      message: "First name input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if last name is present
  if (!lastName) {
    // retun the correct vars
    return res.status(400).json({
      message: "Last name input value missing",
      reqid: res.locals.reqid,
    });
  }

  // create employee update
  const employee = {
    email: email,
    firstName: firstName,
    lastName: lastName
  };

  // update the employee in the database
  Employee.update(employee, {
    where: {
      id: id,
    },
  })
    .then((number) => {
      // check if update worked
      if (number == 1) {
        // update the employee info
        req.session.employee.email = email;
        req.session.employee.firstName = firstName;
        req.session.employee.lastName = lastName;

        // retun the correct vars
        res.status(200).json({
          payload: req.session.employee,
          message: "okay",
          reqid: res.locals.reqid,
        });
      } else {
        // push the error to buffer
        res.locals.errors.push({
          location: "employee.controller.update.1",
          code: "no-update",
          message: "Employee not updated",
          from: "manual",
        });

        // return the correct vars
        res.status(500).json({
          message: "Server error",
          errors: res.locals.errors,
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((error) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "employee.controller.update.2",
        code: error.code,
        message: error.message || "Some error occurred while updating the employee",
        from: "sequelize",
      });

      // return the correct vars
      res.status(500).json({
        message: "Server error",
        errors: res.locals.errors,
        reqid: res.locals.reqid,
      });
    });
};

// reset employee password
exports.password = function (req, res, next) {
  // get the employee id from session
  const id = req.session.employee.id;

  // get the info from json
  const json = req.body;

  // set the vars from post
  const password = json.password;
  const newPassword = json.newPassword;

  // check if password is present
  if (!password) {
    // retun the correct vars
    return res.status(400).json({
      message: "Password input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if password is present
  if (!newPassword) {
    // retun the correct vars
    return res.status(400).json({
      message: "New password input value missing",
      reqid: res.locals.reqid,
    });
  }

  // check if new password is secure
  if (!validator.isStrongPassword(newPassword, { minSymbols: 0 })) {
    // retun the correct vars
    return res.status(400).json({
      message: "New password provided is not secure enough",
      reqid: res.locals.reqid,
    });
  }

  Employee.findOne({
    where: {
      id: id,
    },
  })
    .then((data) => {
      // check if the employee exists
      if (data != null) {
        // store the hash to var
        const hash = data.hash;

        // check the password matches hash
        if (bcrypt.compareSync(password, hash)) {
          // hash the new password
          const newHash = bcrypt.hashSync(newPassword, 10);

          // create employee password update
          const employee = {
            hash: newHash,
          };

          // update the employee password in the database
          Employee.update(employee, {
            where: {
              id: id,
            },
          })
            .then((number) => {
              // check if update worked
              if (number == 1) {
                // retun the correct vars
                res.status(200).json({
                  message: "okay",
                  reqid: res.locals.reqid,
                });
              } else {
                // push the error to buffer
                res.locals.errors.push({
                  location: "employee.controller.password.1",
                  code: "no-update",
                  message: "Employee not found during update",
                  from: "manual",
                });

                // return the correct vars
                res.status(500).json({
                  message: "Server error",
                  errors: res.locals.errors,
                  reqid: res.locals.reqid,
                });
              }
            })
            .catch((error) => {
              // push the error to buffer
              res.locals.errors.push({
                location: "employee.controller.password.2",
                code: error.code,
                message:
                  error.message ||
                  "Some error occurred while updating the employee",
                from: "sequelize",
              });

              // return the correct vars
              res.status(500).json({
                message: "Server error",
                errors: res.locals.errors,
                reqid: res.locals.reqid,
              });
            });
        } else {
          // retun the correct vars
          res.status(401).json({
            message: "Incorrect Password",
            reqid: res.locals.reqid,
          });
        }
      } else {
        // retun the correct vars
        res.status(401).json({
          message: "Employee does not exist",
          reqid: res.locals.reqid,
        });
      }
    })
    .catch((err) => {
      // push the error to buffer
      res.locals.errors.push({
        location: "employee.controller.password.3",
        code: error.code,
        message: err.message || "Some error occurred while finding the employee",
        from: "sequelize",
      });

      // return the correct vars
      res.status(500).json({
        message: "Server error",
        errors: res.locals.errors,
        reqid: res.locals.reqid,
      });
    });
};

// logout of session
exports.logout = function (req, res, next) {
  // destroy the session
  req.session.destroy(function (err) {
    // retun the correct vars
    res.status(200).json({
      message: "okay",
      reqid: res.locals.reqid,
    });
  });
};