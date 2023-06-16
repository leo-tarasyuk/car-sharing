import { Router } from "express";
import {
    getCarHandler,
    postСarHandler,
    putCarInServiceHandler,
    putChangeCarLocationHandler,
    deleteCarHandler,
} from "../controllers/car.controller";

export const carRouter = Router();

carRouter.get("/:carId", getCarHandler);
carRouter.post("/", postСarHandler);
carRouter.put("/in_service", putCarInServiceHandler);
carRouter.put("/", putChangeCarLocationHandler);
carRouter.delete("/:carId", deleteCarHandler);
