import { Types } from "mongoose";
import { ICreateGeometry, IGeometry } from "./geometry.config";

// Enums
export enum LocationType {
  Feature = "Feature",
}

// Interfaces
export interface ICreateLocation {
  type: LocationType;
  geometry: ICreateGeometry;
}

export interface ILocation {
  readonly _id: Types.ObjectId;
  type: LocationType;
  geometry: IGeometry;
}
