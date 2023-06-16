import { Schema, model, Types } from "mongoose";
import { CarStatus } from "../dto/car.dto";

export interface ICarModel {
    vin: string;
    registration_number: number;
    model_id: Types.ObjectId;
    status: CarStatus;
    fuel_level: number;
    mileage: number;
    current_run_id: Schema.Types.ObjectId | null;
    location_id: Types.ObjectId;
    booking_history_ids: Array<number>;
}

const CarScheme = new Schema<ICarModel>(
    {
        vin: {
            type: String,
            required: true,
        },
        registration_number: {
            type: Number,
            required: true,
        },
        model_id: {
            type: Schema.Types.ObjectId,
            ref: "CarModel",
        },
        status: {
            type: String,
            enum: [
                CarStatus.Free,
                CarStatus.In_service,
                CarStatus.In_use,
                CarStatus.Reserved,
                CarStatus.Unavailable,
            ],
            required: true,
        },
        fuel_level: {
            type: Number,
            min: 0,
            max: 100,
            required: true,
        },
        mileage: {
            type: Number,
            required: true,
        },
        current_run_id: {
            type: Schema.Types.ObjectId,
            ref: "Run",
        },
        location_id: {
            type: Schema.Types.ObjectId,
            ref: "Location",
        },
        booking_history_ids: [
            {
                type: Schema.Types.ObjectId,
                ref: "Run",
            },
        ],
    },
    { versionKey: false }
);

export const Car = model<ICarModel>("Car", CarScheme);
