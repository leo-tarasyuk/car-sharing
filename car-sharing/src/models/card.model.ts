import { Schema, model } from "mongoose";

export interface ICardModel {
  number: number;
  owner: string;
  valid_through: string;
}

const LocationScheme = new Schema<ICardModel>({
  number: {
    type: Number,
    required: true,
    minlength: 16,
    maxlength: 16,
  },
  owner: {
    type: String,
    required: true,
  },
  valid_through: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5,
  },
}, { versionKey: false });

export const Card = model<ICardModel>("Card", LocationScheme);
