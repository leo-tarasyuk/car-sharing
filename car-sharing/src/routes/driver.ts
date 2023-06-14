import { Router } from "express";
import {
  getDriverHandler,
  postDriverHandler,
  putDriverHandler,
  deleteDriverHandler,
} from "../controllers/driver.controller";

export const driverRouter = Router();

driverRouter.get("/:driverId", getDriverHandler);
driverRouter.post("/", postDriverHandler);
driverRouter.put("/", putDriverHandler);
driverRouter.delete("/:driverId", deleteDriverHandler);
