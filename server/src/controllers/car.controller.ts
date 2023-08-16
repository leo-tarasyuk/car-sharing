import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { carService } from "../services/car.service";

import { ApiError } from "../exceptions/api.error";

import { ICar, ICreateCar, IReservedCar } from "../dto/car.dto";

/**
 * Controller for creating car
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @param {NextFunction} next Next function
 * @return {Promise<void>}
 */
export const postСarHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const car: ICreateCar = req.body;
        const errors = validationResult(car);

        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation error', errors.array()))
        }

        await carService.createCar(car);
        res.send("Car was created");
    } catch (e) {
        next(e);
    }
};

/**
 * Controller for getting car
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @param {NextFunction} next Next function
 * @return {Promise<void>}
 */
export const getCarHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const errors = validationResult(req.params);

        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation error', errors.array()))
        }

        const { carId } = req.params;
        const car = await carService.getCar(carId);
        res.json(car);
    } catch (e) {
        next(e);
    }
};

/**
 * Controller for change params in car if car has more than 100000 km or older '01/01/2017
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @param {NextFunction} next Next function
 * @return {Promise<void>}
 */
export const putCarInServiceHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const car: ICar = req.body;
        const errors = validationResult(car);

        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation error', errors.array()))
        }

        await carService.changeCar(car);
        res.send("Car was updated");
    } catch (e) {
        next(e);
    }
};

/**
 * Controller for change params in car if car was rented more than 2 times and status is not In_use or Reserved
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @param {NextFunction} next Next function
 * @return {Promise<void>}
 */
export const putChangeCarLocationHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const car: ICar = req.body;
        const errors = validationResult(car);

        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation error', errors.array()))
        }

        await carService.changeCarLocation(car);
        res.send("Car was updated");
    } catch (e) {
        next(e);
    }
};

/**
 * Controller for deleting car
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @param {NextFunction} next Next function
 * @return {Promise<void>}
 */
export const deleteCarHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const errors = validationResult(req.params);

        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation error', errors.array()))
        }

        const { carId } = req.params;
        await carService.deleteCar(carId);
        res.send(`Car was deleted`);
    } catch (e) {
        next(e);
    }
};

/**
 * Controller for show all cars, which are used and has fuel level more, than 25%
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @param {NextFunction} next Next function
 * @return {Promise<void>}
 */
export const getUsedCarsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const cars: Array<ICar> = await carService.getUsedCars();
        res.json(cars);
    } catch (e) {
        next(e);
    }
};

/**
 * Controller for show all cars, which are used and has fuel level more, than 25%
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @param {NextFunction} next Next function
 * @return {Promise<void>}
 */
export const getReservedCarsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const cars: Array<IReservedCar> = await carService.getReservedCars();
        res.json(cars);
    } catch (e) {
        next(e);
    }
};
