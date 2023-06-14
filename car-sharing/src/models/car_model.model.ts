import { Schema, model } from "mongoose";

export interface IModelCarModel {
  brand: string;
  model: string;
  date: Date;
}

const CarModelScheme = new Schema<IModelCarModel>({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
}, { versionKey: false });

export const CarModel = model<IModelCarModel>("CarModel", CarModelScheme);
