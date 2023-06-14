import { Router } from "express";
import { 
    getUsedCarsHandler,
    getFreeCarsHandler,
    getReservedCarsHandler
 } from "../controllers/car.controller";

export const carsRouter = Router();

carsRouter.get("/in_use", getUsedCarsHandler);
carsRouter.get("/reversed", getReservedCarsHandler);
carsRouter.get("/", getFreeCarsHandler);
