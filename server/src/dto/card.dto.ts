import { Types } from "mongoose";

// Interfaces
export interface ICreateCard {
    number: number;
    owner: string;
    valid_through: string;
}

export interface ICard extends ICreateCard {
    readonly _id: Types.ObjectId;
}
