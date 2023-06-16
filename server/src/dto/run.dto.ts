import { Types } from "mongoose";

// Interfaces
export interface IRequestRunParams {
    driverId: Types.ObjectId;
    carId: Types.ObjectId;
}
