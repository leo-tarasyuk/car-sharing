import { Types } from "mongoose";

// Interfaces
export interface ICreateCard {
    number: string;
    owner: string;
    valid_through: string;
}

export interface ICard extends ICreateCard {
    readonly _id: Types.ObjectId;
}
