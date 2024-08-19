import { Router } from "express";

import {MockingController} from "../controller/MockingController.js"
//import { CartController } from "../controller/CartController.js";
export const router = Router();

router.get('/', MockingController.mock); 

    // (req, res) => {
    //     try {
    //      console.log(faker.person.lastName());
    //       return res.json();
    //     } catch {
    //       return res.json({ error: "Unknown error" });
    //     }
    //   }

