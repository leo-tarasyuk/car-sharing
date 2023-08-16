import { Router } from "express";
import { body } from "express-validator";

import {
    getDriverHandler,
    postDriverHandler,
    putDriverHandler,
    deleteDriverHandler,
} from "../controllers/driver.controller";

export const driverRouter = Router();

driverRouter.get("/:driverId", getDriverHandler);
driverRouter.post(
    "/",
    body("license_number").notEmpty().trim(),
    body("first_name").notEmpty().trim(),
    body("last_name").notEmpty().trim(),
    postDriverHandler
);
driverRouter.put(
    "/",
    putDriverHandler,
    body("license_number").notEmpty().trim(),
    body("first_name").notEmpty().trim(),
    body("last_name").notEmpty().trim()
);
driverRouter.delete("/:driverId", deleteDriverHandler);
