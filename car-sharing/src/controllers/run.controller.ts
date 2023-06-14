import { Request, Response } from "express";

import { Run } from "../models/run.model";
import { Driver } from "../models/driver.model";
import { Car } from "../models/car.model";
import { CarStatus } from "../config/car.config";

import { IRequestRunParams } from "../config/run.config";

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
  await Run.createCollection();
  const { driverId, carId }: IRequestRunParams = req.body;
  const driver = await Driver.findOne({ _id: driverId });
  const car = await Car.findOne({ _id: carId, status: CarStatus.Free });

  if (!driver?._id) {
    res.send("No driver");
    return;
  }

  if (!car?._id) {
    res.send("No car");
    return;
  }

  if (car.current_run_id) {
    res.send("Car is running");
    return;
  }

  const newRun = new Run({
    start_fuel_level: car.fuel_level,
    start_mileage: car.mileage,
    start_date: Date.now(),
    driver_id: driver._id,
    start_location_id: car.location_id,
  });
  await newRun.save();

  Car.findOneAndUpdate(
    { _id: car._id },
    { current_run_id: newRun._id, status: CarStatus.In_use }
  )
    .then(() => res.send("The car is run"))
    .catch(() => res.send("You can't rent car"));
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
  const { driverId, carId }: IRequestRunParams = req.body;
  const driver = await Driver.findOne({ _id: driverId });
  const car = await Car.findOne({ _id: carId, status: CarStatus.In_use });

  if (!driver?._id) {
    res.send("No driver");
    return;
  }

  if (!car?._id) {
    res.send("No car");
    return;
  }

  if (!car.current_run_id) {
    res.send("Car is not running");
    return;
  }

  const updatedRun = await Run.findOneAndUpdate(
    { _id: car.current_run_id },
    {
      finish_date: Date.now(),
      finish_fuel_level: car.fuel_level,
      finish_mileage: car.mileage,
      finish_location_id: car.location_id,
    }
  );

  if (!updatedRun?._id) {
    res.send("Run is not found");
    return;
  }

  Car.findByIdAndUpdate(car._id, {
    $set: { current_run_id: null, status: CarStatus.Free },
    $push: { booking_history_ids: updatedRun._id },
  })
    .then(() => res.send("The car is free"))
    .catch(() => res.send("You can't stop the renting car"));
};
