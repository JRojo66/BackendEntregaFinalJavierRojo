import passport from "passport";

const roleMiddleware = (authorizedRoles) => {
  return (req, res, next) => {
    passport.authenticate("current", { session: false })(req, res, () => {
      if (req.user && authorizedRoles.includes(req.user.role)) {
        next();
      } else {
        res.status(403).json({ message: "Your role is not authorized for this route." });
      }
    });
  };
};

export default roleMiddleware;