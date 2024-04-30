module.exports = {
  userIsLoggedIn: (req, res, next) => {
    // usuario debe tener una sesion inciada

    const isLoggedIn = ![null, undefined].includes(req.session.user);

    if (!isLoggedIn) {
      return res.status(401).json({ error: "User should  be logged" });
    }

    next();
  },

  userIsNotLoggedIn: (req, res, next) => {
    // usuario NO debe tener una sesion inciada

    const isLoggedIn = ![null, undefined].includes(req.session.user);

    if (isLoggedIn) {
      return res.status(401).json({ error: "User shouldn't be logged" });
    }

    next();
  },
};
