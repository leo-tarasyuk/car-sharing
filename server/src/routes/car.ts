import { Router } from "express";
import { body } from "express-validator";

import {
    getCarHandler,
    postСarHandler,
    putCarInServiceHandler,
    putChangeCarLocationHandler,
    deleteCarHandler,
} from "../controllers/car.controller";

export const carRouter = Router();

carRouter.get("/:carId", getCarHandler);
carRouter.post(
    "/",
    body("vin").notEmpty().trim(),
    body("registration_number").notEmpty().isNumeric(),
    body("fuel_level").notEmpty().isNumeric(),
    body("mileage").notEmpty().isNumeric(),
    body("model").notEmpty(),
    body("location").notEmpty(),
    postСarHandler
);
carRouter.put(
    "/in_service",
    body("vin").notEmpty().trim(),
    body("registration_number").notEmpty().isNumeric(),
    body("fuel_level").notEmpty().isNumeric(),
    body("mileage").notEmpty().isNumeric(),
    body("model").notEmpty(),
    body("location").notEmpty(),
    putCarInServiceHandler
);
carRouter.put(
    "/",
    body("vin").notEmpty().trim(),
    body("registration_number").notEmpty().isNumeric(),
    body("fuel_level").notEmpty().isNumeric(),
    body("mileage").notEmpty().isNumeric(),
    body("model").notEmpty(),
    body("location").notEmpty(),
    putChangeCarLocationHandler
);
carRouter.delete("/:carId", deleteCarHandler);
