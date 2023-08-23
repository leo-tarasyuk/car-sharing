import { ICreateModelCar, IModelCar } from "./car-model.dto";
import { ICreateLocation, ILocation } from "./location.dto";
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
    vin: string;
    registration_number: number;
    model: ICreateModelCar;
    fuel_level: number;
    mileage: number;
    location: ICreateLocation;
}

export interface ICar extends ICreateCar {
    readonly _id: Types.ObjectId;
    model: IModelCar;
    status: CarStatus;
    location: ILocation;
}

export interface IReservedCar {
    readonly _id: Types.ObjectId;
    vin: string;
    location: Array<number>;
    first_name: string;
    last_name: string;
    license_number: string;
}
