import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    handler: (req, res) => {
        res.redirect(('/?error=Too many tries. Try again in 1 hour'));
      },
    standardHeaders: true,
    legacyHeaders: false,
  });

export default loginLimiter;


