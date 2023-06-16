import { Router } from "express";
import {
    getUsedCarsHandler,
    getReservedCarsHandler,
} from "../controllers/car.controller";

export const carsRouter = Router();

carsRouter.get("/in_use", getUsedCarsHandler);
carsRouter.get("/reserved", getReservedCarsHandler);
