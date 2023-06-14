import { Router } from "express";

import { carRouter } from "./car";
import { carsRouter } from "./cars";
import { driverRouter } from "./driver";
import { runRouter } from "./run";

export const router = Router();

router.use("/car", carRouter);
router.use("/cars", carsRouter);
router.use("/driver", driverRouter);
router.use("/run", runRouter);
