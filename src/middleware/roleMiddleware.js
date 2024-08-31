import passport from "passport";

const roleMiddleware = (authorizedRoles) => {
  return (req, res, next) => {
    console.log(req.user.role);                                                                         // clg
    if(!req.user){
      res.setHeader('Content-Type','application/json');
      return res.status(403).json({error:`Not logged in users...!`})
    }

    console.log(req.user.loginStrategy);                                                                         // clg  
    if(req.user.loginStrategy === "jwt"){  
      passport.authenticate("current", { session: false })(req, res, () => {
        if (req.user && authorizedRoles.includes(req.user.role)) {
          next();
        } else {
          res.status(403).json({ message: "Your role is not authorized for this route." });
        }
      });
    }
    if(req.user.loginStrategy === "gitHub"){
      passport.authenticate("gitHub", { session: false })(req, res, () => {
        if (req.user && authorizedRoles.includes(req.user.role)) {
          next();
        } else {
          res.status(403).json({ message: "Your role is not authorized for this route." });
        }
      });
    }
  }
};

export default roleMiddleware;