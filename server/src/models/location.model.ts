import { Schema, model } from "mongoose";
import { LocationType } from "../dto/location.dto";

export interface ILocationModel {
    type: LocationType;
    geometry_id: Schema.Types.ObjectId;
}

const LocationScheme = new Schema<ILocationModel>(
    {
        type: {
            type: String,
            enum: [LocationType.Feature],
            required: true,
        },
        geometry_id: {
            type: Schema.Types.ObjectId,
            ref: "Geometry",
        },
    },
    { versionKey: false }
);

export const Location = model<ILocationModel>("Location", LocationScheme);
