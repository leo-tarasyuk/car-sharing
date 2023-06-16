import { Request, Response } from "express";

import { carService } from "../services/car.service";

import { ICar, ICreateCar, IReservedCar } from "../dto/car.dto";

/**
 * Controller for creating car
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const postСarHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    const car: ICreateCar = req.body;
    await carService.createCar(car);
    res.send("Car was created");
};

/**
 * Controller for getting car
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const getCarHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const carId: string = req.params.carId;
        const car = await carService.getCar(carId);
        res.send(car);
    } catch (e) {
        res.send(e);
    }
};

/**
 * Controller for change params in car if car has more than 100000 km or older '01/01/2017
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const putCarInServiceHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const car: ICar = req.body;
        await carService.changeCar(car);
        res.send("Car was updated");
    } catch (e) {
        res.send(e);
    }
};

/**
 * Controller for change params in car if car was rented more than 2 times and status is not In_use or Reserved
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const putChangeCarLocationHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const car: ICar = req.body;
        await carService.changeCarLocation(car);
    } catch (e) {
        res.send(e);
    }
};

/**
 * Controller for deleting car
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const deleteCarHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const carId: string = req.params.carId;
        await carService.deleteCar(carId);
        res.send(`Car was deleted`);
    } catch (e) {
        res.send(e);
    }
};

/**
 * Controller for show all cars, which are used and has fuel level more, than 25%
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const getUsedCarsHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const cars: Array<ICar> = await carService.getUsedCars();
        res.send(cars);
    } catch (e) {
        res.send(e);
    }
};

/**
 * Controller for show all cars, which are used and has fuel level more, than 25%
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const getReservedCarsHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const cars: Array<IReservedCar> = await carService.getReservedCars();
        res.send(cars);
    } catch (e) {
        res.send(e);
    }
};
