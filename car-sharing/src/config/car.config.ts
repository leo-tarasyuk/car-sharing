import { ICreateModelCar, IModelCar } from "./car_model.config";
import { ICreateLocation, ILocation } from "./location.config";
import { Types } from "mongoose";

// Enums
export enum CarStatus {
  Free = "Free",
  Reserved = "Reserved",
  In_use = "In use",
  Unavailable = "Unavailable",
  In_service = "In service",
}

// Interfaces
export interface ICreateCar {
  vin: number;
  registration_number: number;
  model: ICreateModelCar;
  status: CarStatus;
  fuel_level: number;
  mileage: number;
  location: ICreateLocation;
}

export interface ICar extends ICreateCar {
  readonly _id: Types.ObjectId;
  model: IModelCar;
  location: ILocation;
}
