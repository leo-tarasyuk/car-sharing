import { Request, Response } from "express";

import { runService } from "../services/run.service";

import { IRequestRunParams } from "../dto/run.dto";

/**
 * Controller for renting car
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const postRentHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { driverId, carId }: IRequestRunParams = req.body;
        await runService.startRentCar(driverId, carId);
        res.send("The car is run");
    } catch (e) {
        res.send(e);
    }
};

/**
 * Controller for stopping a rent
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const postStopHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { driverId, carId }: IRequestRunParams = req.body;
        await runService.stopRentCar(driverId, carId);
        res.send("The car is free");
    } catch (e) {
        res.send(e);
    }
};
