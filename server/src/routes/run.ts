import { Router } from "express";
import { body } from "express-validator";

import {
    postRentHandler,
    postStopHandler,
} from "../controllers/run.controller";

export const runRouter = Router();

runRouter.post(
    "/on",
    body("driverId").notEmpty().trim(),
    body("carId").notEmpty().trim(),
    postRentHandler
);
runRouter.post(
    "/off",
    body("driverId").notEmpty().trim(),
    body("carId").notEmpty().trim(),
    postStopHandler
);
