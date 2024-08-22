import { Router } from "express";
import { SessionsController } from "../controller/SessionsController.js";
import { upload } from "../utils.js";

export const router = Router();

router.get("/premium/:uid", SessionsController.premium);
router.post(
  "/:uid/documents",
  upload.single("document"),
  SessionsController.addDocument
);
router.post(
  "/:uid/documents/profile",
  upload.single("profile"),
  SessionsController.addDocument
);
router.post(
  "/:uid/documents/product",
  upload.single("product"),
  SessionsController.addDocument
);
router.post(
  "/:uid/documents/identification",
  upload.single("identification"),
  SessionsController.addDocument
);
router.post(
  "/:uid/documents/addressProof",
  upload.single("addressProof"),
  SessionsController.addDocument
);
router.post(
  "/:uid/documents/bankStatement",
  upload.single("bankStatement"),
  SessionsController.addDocument
);
