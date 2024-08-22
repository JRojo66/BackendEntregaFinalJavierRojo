import { Router } from "express";
import { __dirname } from "../utils.js";
import { CartController } from "../controller/CartController.js";
import passport from "passport";
import { TicketController } from "../controller/TicketController.js";

export const router = Router();

router.get("/", CartController.getAllCarts);
router.get("/:cid", CartController.getCartById);

// jwt login and user/premim/admin role required
router.post(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  (req, res, next) => {
    if (
      req.user.role === "user" ||
      req.user.role === "premium" ||
      req.user.role === "admin"
    ) {
      CartController.addProductInCart(req, res, next);
    } else {
      res.status(403).json({ message: "user or premium role required." });
    }
  }
);
router.put("/:cid", CartController.updateCart);
router.put("/:cid/products/:pid", CartController.updateQty);
router.delete("/:cid/product/:pid", CartController.deleteProduct);
router.delete("/:cid", CartController.deleteAllProductsInCart);
router.post("/:cid/purchase", TicketController.createTicket);
