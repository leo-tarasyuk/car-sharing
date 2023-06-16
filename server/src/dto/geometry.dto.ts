import { Types } from "mongoose";

// Enums
export enum GeometryType {
    Point = "Point",
}

// Interfaces
export interface ICreateGeometry {
    type: GeometryType;
    coordinates: Array<number>;
}

export interface IGeometry extends ICreateGeometry {
    readonly _id: Types.ObjectId;
}
