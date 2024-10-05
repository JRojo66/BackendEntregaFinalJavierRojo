import { Router } from "express";
import { __dirname } from "../utils.js";
import { ViewsController } from "../controller/ViewsController.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

export const router = Router();

router.get("/", ViewsController.login);
router.get("/register", ViewsController.register);
router.get("/logout", ViewsController.logout);
router.get("/passwordReset", ViewsController.passwordReset);
router.get("/passwordResetForm", ViewsController.passwordResetForm);
router.get("/chat", roleMiddleware(["premium", "user"]), ViewsController.chat);

export default router;
