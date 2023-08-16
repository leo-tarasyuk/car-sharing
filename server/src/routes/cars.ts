import { Router } from "express";
import { body } from "express-validator";

import {
    getUsedCarsHandler,
    getReservedCarsHandler,
} from "../controllers/car.controller";

export const carsRouter = Router();

carsRouter.get(
    "/in_use",
    body("model").notEmpty(),
    body("location").notEmpty(),
    getUsedCarsHandler
);
carsRouter.get(
    "/reserved",
    body("vin").notEmpty().trim(),
    body("location").notEmpty(),
    body("first_name").notEmpty().trim(),
    body("last_name").notEmpty().trim(),
    body("license_number").notEmpty().trim(),
    getReservedCarsHandler
);
