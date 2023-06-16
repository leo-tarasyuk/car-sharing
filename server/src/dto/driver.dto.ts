import { Types } from "mongoose";

import { ICard } from "./card.dto";

// Interfaces
export interface ICreateDriver {
    license_number: number;
    first_name: string;
    last_name: string;
    credit_card: ICard | null;
    credit_card_id?: Types.ObjectId | null;
}

export interface IDriver extends ICreateDriver {
    readonly _id: Types.ObjectId;
}