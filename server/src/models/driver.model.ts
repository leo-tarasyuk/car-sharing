import { Schema, model } from "mongoose";

export interface IDriverModel {
    license_number: number;
    first_name: string;
    last_name: string;
    credit_card_id: Schema.Types.ObjectId | null;
}

const LocationScheme = new Schema<IDriverModel>(
    {
        license_number: {
            type: Number,
            required: true,
        },
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        credit_card_id: {
            type: Schema.Types.ObjectId,
            ref: "Card",
        },
    },
    { versionKey: false }
);

export const Driver = model<IDriverModel>("Driver", LocationScheme);
