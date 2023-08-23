import { Car, ICarModel } from "../models/car.model";
import { CarModel } from "../models/car_model.model";
import { Location } from "../models/location.model";
import { Geometry } from "../models/geometry.model";

import { CarStatus, ICar, ICreateCar, IReservedCar } from "../dto/car.dto";

import { limitCarDate } from "../config/time.config";

class CarService {
    private async overwriteCarInfo(car: ICar): Promise<void> {
        await Car.findOneAndUpdate(
            { _id: car._id },
            {
                status: CarStatus.In_service,
                fuel_level: car.fuel_level,
                mileage: car.mileage,
            }
        );

        if (car.location?._id) {
            await Location.findOneAndUpdate(
                { _id: car.location._id },
                car.location
            );
        }

        if (car.location?.geometry?._id) {
            await Geometry.findOneAndUpdate(
                { _id: car.location.geometry._id },
                car.location.geometry
            );
        }
    }

    async createCar(carInfo: ICreateCar): Promise<void> {
        const reqModel = await CarModel.findOne(carInfo.model);
        const reqGeometry = await Geometry.findOne(carInfo.location.geometry);
        const newModel = new CarModel(carInfo.model);
        const newGeometry = new Geometry(carInfo.location.geometry);
        const model = reqModel ? reqModel : await newModel.save();
        const geo = reqGeometry ? reqGeometry : await newGeometry.save();

        let location = geo._id
            ? await Location.findOne({ geometry_id: geo._id })
            : null;

        if (!location) {
            const newLocation = new Location({
                type: carInfo.location.type,
                geometry_id: geo._id,
            });
            location = await newLocation.save();
        }

        const carData: ICarModel = {
            vin: carInfo.vin,
            registration_number: carInfo.registration_number,
            model_id: model._id,
            status: CarStatus.In_service,
            current_run_id: null,
            fuel_level: carInfo.fuel_level,
            mileage: carInfo.mileage,
            location_id: location._id,
            booking_history_ids: [],
        };

        const car = await Car.findOne({ vin: carData.vin });

        if (car) {
            throw Error("Car was created");
        } else {
            const newCar = new Car(carData);
            await newCar.save();
        }
    }

    async getCar(carId: string): Promise<ICar> {
        const cars = await Car.aggregate([
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
        ]);

        return cars[0];
    }

    async changeCar(car: ICar): Promise<void> {
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
            await this.overwriteCarInfo(car);
        } else {
            throw Error("You can't update this car");
        }
    }

    async changeCarLocation(car: ICar): Promise<void> {
        const cars = await Car.aggregate([
            {
                $match: {
                    $expr: { $eq: ["$_id", { $toObjectId: car._id }] },
                    status: { $ne: CarStatus.In_use || CarStatus.Reserved },
                },
            },
        ]);

        if (cars[0]?.booking_history_ids?.length >= 2) {
            await this.overwriteCarInfo(car);
        } else {
            throw Error(`You can't update this car`);
        }
    }

    async deleteCar(carId: string): Promise<void> {
        Car.findOneAndDelete({ _id: carId });
    }

    async getUsedCars(): Promise<Array<ICar>> {
        const cars: Array<ICar> = await Car.aggregate([
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
                    "current_run_id",
                    "location.geometry_id",
                    "booking_history_ids",
                ],
            },
        ]);

        return cars;
    }

    async getReservedCars(): Promise<Array<IReservedCar>> {
        const cars: Array<IReservedCar> = await Car.aggregate([
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
                $unset: [
                    "model_id",
                    "location_id",
                    "current_run_id",
                    "location.geometry_id",
                    "booking_history_ids",
                    "current_run.driver_id",
                ],
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
                    license_number: {
                        $first: "$current_run.driver.license_number",
                    },
                },
            },
        ]);

        return cars;
    }
}

export const carService = new CarService();
