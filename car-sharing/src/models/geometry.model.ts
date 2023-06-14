import { Schema, model } from "mongoose";
import { GeometryType } from "../config/geometry.config";

interface IGeometryModel {
  type: GeometryType;
  coordinates: Array<number>;
}

const GeometryScheme = new Schema<IGeometryModel>({
  type: {
    type: String,
    enum: [GeometryType.Point],
    required: true,
  },
  coordinates: [Number],
}, { versionKey: false });

export const Geometry = model<IGeometryModel>("Geometry", GeometryScheme);