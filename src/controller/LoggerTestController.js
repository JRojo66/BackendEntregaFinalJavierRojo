import { customLogger } from "../utils.js";
import { fakerEN_US as faker } from "@faker-js/faker";

export class LoggerTestController {
  static log = (req, res) => {
    customLogger.fatal("loggerTest fatal");
    customLogger.error("loggerTest error");
    customLogger.warning("loggerTest warning");
    customLogger.info("loggerTest info");
    customLogger.http("loggerTest http");
    customLogger.debug("loggerTest debug");
    return res.json("logger test successful...!!!");
  };
}
