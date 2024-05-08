const authorizationMiddleware = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ error: "User should authenticate" });
    }

    if (!req.user.role || req.user.role !== role) {
      return res.status(403).send({ error: "User need permissions" });
    }

    next();
  };
};

module.exports = authorizationMiddleware;
