import { Types } from "mongoose";

import { ICard } from "../config/card.config"

// Interfaces
export interface IDriver {
    readonly _id: Types.ObjectId;
    license_number: number;
    first_name: string;
    last_name: string;
    credit_card: ICard | null;
    credit_card_id?: Types.ObjectId | null;
}