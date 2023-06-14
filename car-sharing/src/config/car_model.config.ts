import { Types } from "mongoose";

// Interfaces
export interface ICreateModelCar {
  brand: string;
  model: string;
  date: Date;
}

export interface IModelCar extends ICreateModelCar {
  readonly _id: Types.ObjectId;
}
