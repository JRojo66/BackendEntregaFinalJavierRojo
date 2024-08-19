import { Router } from "express";
import { CartManagerMONGO as CartManager } from "../dao/CartManagerMONGO.js";
import { __dirname } from "../utils.js";
import { authjwt } from "../middleware/auth.js";
import { auth } from "../middleware/auth.js";
import { ViewsController } from "../controller/ViewsController.js";
import passport from "passport";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { upload } from "../utils.js";


export const router = Router();                                                           

const cartManager = new CartManager();

router.get('/',ViewsController.home); 
router.get("/createProduct",roleMiddleware(["admin","premium"]), ViewsController.createProduct);
router.get("/products", roleMiddleware(["premium","user"]),ViewsController.products);
router.get("/users/documents",roleMiddleware(["admin","premium","user"]),ViewsController.attachFiles);
router.get("/users/documents/profile",roleMiddleware(["admin","premium","user"]),ViewsController.attachFilesProfile);
router.get("/users/documents/product",roleMiddleware(["admin","premium","user"]),ViewsController.attachFilesProduct);
router.get("/users/documents/identification",roleMiddleware(["admin","premium","user"]),ViewsController.attachFilesIdentification);
router.get("/users/documents/addressProof",roleMiddleware(["admin","premium","user"]),ViewsController.attachFilesAddressProof);
router.get("/users/documents/bankStatement",roleMiddleware(["admin","premium","user"]),ViewsController.attachFilesBankStatement);
router.get("/realtimeproducts", ViewsController.realTimeProducts);
router.get("/cart/:cid",roleMiddleware(["admin","premium","user"]),ViewsController.getCartById);
router.get("/register", ViewsController.register);
router.get("/login", ViewsController.login);
router.get("/loginJWT", ViewsController.loginJWT);
router.get("/logoutJWT", ViewsController.logoutJWT);
router.get("/login/github", ViewsController.loginGitHub);
router.get("/passwordReset", ViewsController.passwordReset);
router.get("/passwordResetForm", ViewsController.passwordResetForm);
router.get("/profile", auth,roleMiddleware(["admin","premium","user"]),ViewsController.profile);                                                      // Revisar auth+roleMiddleware?
router.get("/logout",roleMiddleware(["admin","premium","user"]), ViewsController.logout);
router.get('/chat',roleMiddleware(["premium","user"]),ViewsController.chat); 


export default router;
