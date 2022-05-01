exports.simple = () => {
    return (req, res, next) => {
      // check if the user is logged in
      if (req.session.user) {
        next();
      } else {
        res.status(401).json({
          message: "User not logged in",
          reqid: res.locals.reqid,
        });
      }
    };
  };