import { Request, Response } from "express";

import { driverService } from "../services/driver.service";

import { IDriver, ICreateDriver } from "../dto/driver.dto";

/**
 * Controller for creating driver
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const postDriverHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const driver: ICreateDriver = req.body;
        await driverService.createDriver(driver);
        res.send("Driver was created");
    } catch (e) {
        res.send(e);
    }
};

/**
 * Controller for getting driver
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const getDriverHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const driverId: string = req.params.driverId;
        const driver = await driverService.getDriver(driverId);
        res.send(driver);
    } catch (e) {
        res.send(e);
    }
};

/**
 * Controller for change params in driver
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const putDriverHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const driver: IDriver = req.body;
        await driverService.changeDriver(driver);
        res.send(`Driver was updated`);
    } catch (error) {
        res.send(error);
    }
};

/**
 * Controller for deleting driver
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const deleteDriverHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const driverId: string = req.params.driverId;
        await driverService.deleteDriver(driverId);
        res.send(`Driver was deleted`);
    } catch (e) {
        res.send(e);
    }
};
