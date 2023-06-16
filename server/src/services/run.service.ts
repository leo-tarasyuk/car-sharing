import { Types } from "mongoose";

import { Run } from "../models/run.model";
import { Driver } from "../models/driver.model";
import { Car } from "../models/car.model";

import { CarStatus } from "../dto/car.dto";

class RunService {
    async startRentCar(
        driverId: Types.ObjectId,
        carId: Types.ObjectId
    ): Promise<void> {
        const driver = await Driver.findOne({ _id: driverId });
        const car = await Car.findOne({ _id: carId, status: CarStatus.Free });

        if (!driver?._id) {
            throw `No driver`;
        }

        if (!car?._id) {
            throw `No car`;
        }

        if (car.current_run_id) {
            throw `Car is running`;
        }

        const newRun = new Run({
            start_fuel_level: car.fuel_level,
            start_mileage: car.mileage,
            start_date: Date.now(),
            driver_id: driver._id,
            start_location_id: car.location_id,
        });

        await newRun.save();
        await Car.findOneAndUpdate(
            { _id: car._id },
            { current_run_id: newRun._id, status: CarStatus.In_use }
        );
    }

    async stopRentCar(
        driverId: Types.ObjectId,
        carId: Types.ObjectId
    ): Promise<void> {
        const driver = await Driver.findOne({ _id: driverId });
        const car = await Car.findOne({ _id: carId, status: CarStatus.In_use });

        if (!driver?._id) {
            throw `No driver`;
        }

        if (!car?._id) {
            throw `No car`;
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
            throw `Run is not found`;
        }

        await Car.findByIdAndUpdate(car._id, {
            $set: { current_run_id: null, status: CarStatus.Free },
            $push: { booking_history_ids: updatedRun._id },
        });
    }
}

export const runService = new RunService();
