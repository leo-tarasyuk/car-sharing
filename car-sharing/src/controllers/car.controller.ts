import { Request, Response } from "express";
import { Types } from "mongoose";

import { Car, ICarModel } from "../models/car.model";
import { CarModel } from "../models/car_model.model";
import { Location } from "../models/location.model";
import { Geometry } from "../models/geometry.model";

import { CarStatus, ICar } from "../config/car.config";

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
  await CarModel.createCollection();
  await Car.createCollection();
  await Location.createCollection();
  await Geometry.createCollection();

  const reqGeometry = await Geometry.findOne(req.body.location.geometry);
  const reqModel = await Geometry.findOne(req.body.modal);
  const newModel = new CarModel(req.body.model);
  const newGeometry = new Geometry(req.body.location.geometry);
  const model = reqModel ? reqModel : await newModel.save();
  const geo = reqGeometry ? reqGeometry : await newGeometry.save();

  let location = geo._id
    ? await Location.findOne({ geometry_id: geo._id })
    : null;

  if (!location) {
    const newLocation = new Location({
      type: req.body.location.type,
      geometry_id: geo._id,
    });
    location = await newLocation.save();
  }

  const carData: ICarModel = {
    vin: req.body.vin,
    registration_number: req.body.registration_number,
    model_id: model._id,
    status: CarStatus.In_service,
    current_run_id: null,
    fuel_level: req.body.fuel_level,
    mileage: req.body.mileage,
    location_id: location._id,
    booking_history_ids: [],
  };

  const car = await Car.findOne({ vin: carData.vin });

  if (car) {
    res.send("Error: Car was created");
  } else {
    const newCar = new Car(carData);
    newCar.save().then(() => res.send("Car is created"));
  }
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
  const carId: Types.ObjectId | string = req.params.carId;

  Car.aggregate([
    {
      $match: { $expr: { $eq: ["$_id", { $toObjectId: carId }] } },
    },
    {
      $lookup: {
        from: "carmodels",
        localField: "model_id",
        foreignField: "_id",
        as: "model",
      },
    },
    {
      $unwind: "$model",
    },
    {
      $lookup: {
        from: "locations",
        localField: "location_id",
        foreignField: "_id",
        as: "location",
      },
    },
    {
      $unwind: "$location",
    },
    {
      $lookup: {
        from: "geometries",
        localField: "location.geometry_id",
        foreignField: "_id",
        as: "location.geometry",
      },
    },
    {
      $unwind: "$location.geometry",
    },
    {
      $lookup: {
        from: "runs",
        localField: "booking_history_ids",
        foreignField: "_id",
        as: "booking_history",
      },
    },
    {
      $unset: [
        "model_id",
        "location_id",
        "location.geometry_id",
        "booking_history_ids",
      ],
    },
  ])
    .then((cars: Array<ICar>) => res.send(cars[0]))
    .catch(() => res.send(`Error: Car is not with ${carId} id`));
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
  const car: ICar = req.body;
  const limitCarDate: Date = new Date("01/01/2017");
  const cars = await Car.aggregate([
    {
      $match: { $expr: { $eq: ["$_id", { $toObjectId: car._id }] } },
    },
    {
      $lookup: {
        from: "carmodels",
        localField: "model_id",
        foreignField: "_id",
        as: "model",
      },
    },
    {
      $unwind: "$model",
    },
    {
      $match: {
        $or: [
          {
            mileage: {
              $gte: 100000,
            },
          },
          {
            "model.date": {
              $lte: limitCarDate,
            },
          },
        ],
      },
    },
  ]);

  if (cars[0]) {
    Car.findOneAndUpdate(
      { _id: car._id },
      {
        status: CarStatus.In_service,
        fuel_level: car.fuel_level,
        registration_number: car.registration_number,
      }
    )
      .then(async () => {
        if (car.location?._id)
          await Location.findOneAndUpdate(
            { _id: car.location._id },
            car.location
          );
      })
      .then(async () => {
        if (car.location?.geometry?._id)
          await Geometry.findOneAndUpdate(
            { _id: car.location.geometry._id },
            car.location.geometry
          );
      })
      .then(() => res.send(`Car was updated`))
      .catch(() => res.send(`You can't update this car`));
  } else res.send(`You can't update this car`);
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
  const car: ICar = req.body;
  const cars = await Car.aggregate([
    {
      $match: {
        $expr: { $eq: ["$_id", { $toObjectId: car._id }] },
        status: { $ne: CarStatus.In_use || CarStatus.Reserved },
      },
    },
  ]);

  if (cars[0]?.booking_history_ids?.length >= 2) {
    Car.findOneAndUpdate(
      { _id: car._id },
      {
        status: CarStatus.In_service,
        fuel_level: car.fuel_level,
        registration_number: car.registration_number,
      }
    )
      .then(async () => {
        if (car.location?._id)
          await Location.findOneAndUpdate(
            { _id: car.location._id },
            car.location
          );
      })
      .then(async () => {
        if (car.location?.geometry?._id)
          await Geometry.findOneAndUpdate(
            { _id: car.location.geometry._id },
            car.location.geometry
          );
      })
      .then(() => res.send(`Car was updated`))
      .catch(() => res.send(`You can't update this car`));
  } else res.send(`You can't update this car`);
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
  const carId: Types.ObjectId | string = req.params.carId;

  Car.findOneAndDelete({ _id: carId })
    .then(() => res.send(`Car was deleted`))
    .catch(() => res.send(`Cat with ${carId} vin is not found`));
};

/**
 * TODO: Controller for show all free cars
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const getFreeCarsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const allCars: Array<ICarModel> = await Car.find({ status: CarStatus.Free });

  res.send(allCars);
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
  Car.aggregate([
    {
      $match: {
        status: CarStatus.In_use,
        fuel_level: { $gte: 25 },
      },
    },
    {
      $lookup: {
        from: "carmodels",
        localField: "model_id",
        foreignField: "_id",
        as: "model",
      },
    },
    {
      $unwind: "$model",
    },
    {
      $lookup: {
        from: "runs",
        localField: "current_run_id",
        foreignField: "_id",
        as: "current_run",
      },
    },
    {
      $unwind: "$current_run",
    },
    {
      $lookup: {
        from: "locations",
        localField: "location_id",
        foreignField: "_id",
        as: "location",
      },
    },
    {
      $unwind: "$location",
    },
    {
      $lookup: {
        from: "geometries",
        localField: "location.geometry_id",
        foreignField: "_id",
        as: "location.geometry",
      },
    },
    {
      $unwind: "$location.geometry",
    },
    {
      $lookup: {
        from: "runs",
        localField: "booking_history_ids",
        foreignField: "_id",
        as: "booking_history",
      },
    },
    {
      $unset: [
        "model_id",
        "location_id",
        "location.geometry_id",
        "booking_history_ids",
      ],
    },
  ])
    .then((cars: Array<ICar>) => res.send(cars))
    .catch(() => res.send(`Error:`));
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
  Car.aggregate([
    {
      $match: {
        status: CarStatus.Reserved,
      },
    },
    {
      $lookup: {
        from: "locations",
        localField: "location_id",
        foreignField: "_id",
        as: "location",
      },
    },
    {
      $unwind: "$location",
    },
    {
      $lookup: {
        from: "geometries",
        localField: "location.geometry_id",
        foreignField: "_id",
        as: "location.geometry",
      },
    },
    {
      $unwind: "$location.geometry",
    },
    {
      $lookup: {
        from: "runs",
        localField: "current_run_id",
        foreignField: "_id",
        as: "current_run",
      },
    },
    {
      $unwind: "$current_run",
    },
    {
      $lookup: {
        from: "drivers",
        localField: "current_run.driver_id",
        foreignField: "_id",
        as: "current_run.driver",
      },
    },
    {
      $unwind: "$current_run.driver",
    },
    {
      $match: {
        "current_run.driver.credit_card_id": null,
      },
    },
    {
      $group: {
        _id: "$_id",
        vin: { $first: "$vin" },
        location: { $first: "$location.geometry.coordinates" },
        first_name: { $first: "$current_run.driver.first_name" },
        last_name: { $first: "$current_run.driver.last_name" },
        license_number: { $first: "$current_run.driver.license_number" },
      },
    },
  ])
    .then((cars: Array<ICar>) => res.send(cars))
    .catch(() => res.send(`Error:`));
};
