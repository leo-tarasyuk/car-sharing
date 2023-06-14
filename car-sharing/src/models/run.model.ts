import { Schema, model } from "mongoose";

export interface IRunModel {
    start_date: Date,
    start_fuel_level: number,
    start_mileage: number,
    start_location_id: Schema.Types.ObjectId,
    driver_id: Schema.Types.ObjectId,
    finish_date?: Date,
    finish_fuel_level?: number,
    finish_mileage?: number,
    finish_location_id?: Schema.Types.ObjectId,
};

const CarScheme = new Schema<IRunModel>({
  start_date: {
    type: Date,
    default: Date.now(),
  },
  start_fuel_level: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  start_mileage: {
    type: Number,
    required: true,
  },
  start_location_id: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
  driver_id: {
    type: Schema.Types.ObjectId,
    ref: 'Driver'
  },
  finish_date: Date,
  finish_fuel_level: {
    type: Number,
    min: 0,
    max: 100,
  },
  finish_mileage: Number,
  finish_location_id: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
}, { versionKey: false });

export const Run = model<IRunModel>("Run", CarScheme);
