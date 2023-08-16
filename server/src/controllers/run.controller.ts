import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { runService } from "../services/run.service";

import { ApiError } from "../exceptions/api.error";

import { IRequestRunParams } from "../dto/run.dto";

/**
 * Controller for renting car
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @param {NextFunction} next Next function
 * @return {Promise<void>}
 */
export const postRentHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const errors = validationResult(req.body);

        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation error', errors.array()))
        }

        const { driverId, carId }: IRequestRunParams = req.body;
        await runService.startRentCar(driverId, carId);
        res.send("The car is run");
    } catch (e) {
        next(e);
    }
};

/**
 * Controller for stopping a rent
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @param {NextFunction} next Next function
 * @return {Promise<void>}
 */
export const postStopHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const errors = validationResult(req.body);

        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation error', errors.array()))
        }

        const { driverId, carId }: IRequestRunParams = req.body;
        await runService.stopRentCar(driverId, carId);
        res.send("The car is free");
    } catch (e) {
        next(e);
    }
};
