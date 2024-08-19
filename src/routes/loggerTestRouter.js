import { Router } from "express";
import {LoggerTestController} from "../controller/LoggerTestController.js"

export const router = Router();

router.get('/', LoggerTestController.log); 