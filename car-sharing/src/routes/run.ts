import { Router } from "express";
import {
    postRentHandler,
    postStopHandler
} from "../controllers/run.controller";

export const runRouter = Router();

runRouter.post("/on", postRentHandler);
runRouter.post("/off", postStopHandler);
