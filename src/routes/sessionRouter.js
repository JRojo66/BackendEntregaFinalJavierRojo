import { Router } from "express";
import passport from "passport";
import { SessionsController } from "../controller/SessionsController.js";
import loginLimiter from "../middleware/rateLimiter.js";

export const router = Router();

router.get("/", SessionsController.redirectToMain);
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/api/sessions/error" }),
  SessionsController.register
);
router.post(
  "/login",loginLimiter,
  passport.authenticate("login", { failureRedirect: "/api/sessions/error" }),
  SessionsController.login
);
router.post("/passwordReset", SessionsController.passwordReset);
router.get("/error", SessionsController.error);
router.get("/logout", SessionsController.logout);
router.get("/current", SessionsController.current);
