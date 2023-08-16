import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { driverService } from "../services/driver.service";

import { ApiError } from "../exceptions/api.error";

import { IDriver, ICreateDriver } from "../dto/driver.dto";

/**
 * Controller for creating driver
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @param {NextFunction} next Next function
 * @return {Promise<void>}
 */
export const postDriverHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response<string, Record<string, string>> | void> => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation error', errors.array()))
        }

        const driver: ICreateDriver = req.body;
        await driverService.createDriver(driver);

        return res.send("Driver was created");
    } catch (e) {
        next(e);
    }
};

/**
 * Controller for getting driver
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @param {NextFunction} next Next function
 * @return {Promise<void>}
 */
export const getDriverHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const errors = validationResult(req.params);

        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation error', errors.array()))
        }

        const driverId: string = req.params.driverId;
        const driver = await driverService.getDriver(driverId);

        res.json(driver);
    } catch (e) {
        next(e);
    }
};

/**
 * Controller for change params in driver
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @param {NextFunction} next Next function
 * @return {Promise<void>}
 */
export const putDriverHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation error', errors.array()))
        }

        const driver: IDriver = req.body;
        await driverService.changeDriver(driver);
        res.send(`Driver was updated`);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller for deleting driver
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @param {NextFunction} next Next function
 * @return {Promise<void>}
 */
export const deleteDriverHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const errors = validationResult(req.params);

        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation error', errors.array()))
        }

        const driverId: string = req.params.driverId;
        await driverService.deleteDriver(driverId);
        res.send(`Driver was deleted`);
    } catch (e) {
        next(e);
    }
};
