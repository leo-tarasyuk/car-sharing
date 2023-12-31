import { Driver } from "../models/driver.model";
import { Card } from "../models/card.model";

import { IDriver, ICreateDriver } from "../dto/driver.dto";

export class DriverService {
    async createDriver(driverInfo: ICreateDriver): Promise<void> {
        const { license_number, first_name, last_name, credit_card } = driverInfo;

        let credit_card_id = null;

        const reqCreditCard = credit_card?.number
            ? await Card.findOne({ number: credit_card.number })
            : null;

        if (reqCreditCard?._id) {
            credit_card_id = reqCreditCard._id;
        } else {
            const newCreditCard = new Card(credit_card);
            await newCreditCard.save();
            credit_card_id = newCreditCard._id;
        }

        const driver = await Driver.findOne({ license_number });

        if (driver) {
            throw Error(`Driver was created`);
        } else {
            const newDriver = new Driver({
                license_number,
                first_name,
                last_name,
                credit_card_id,
            });
            await newDriver.save();
        }
    }

    async getDriver(driverId: string): Promise<IDriver> {
        const drivers: Array<IDriver> = await Driver.aggregate([
            {
                $match: { $expr: { $eq: ["$_id", { $toObjectId: driverId }] } },
            },
            {
                $lookup: {
                    from: "cards",
                    localField: "credit_card_id",
                    foreignField: "_id",
                    as: "credit_card",
                },
            },
            {
                $unwind: {
                    "path": "$credit_card",
                    "preserveNullAndEmptyArrays": true
                },
            },
            {
                $unset: ["credit_card_id"],
            },
        ]);

        return drivers[0];
    }

    async changeDriver(driver: IDriver): Promise<void> {
        await Driver.findOneAndUpdate({ _id: driver._id }, driver);

        if (driver.credit_card?._id) {
            await Card.findOneAndUpdate(
                { _id: driver.credit_card._id },
                driver.credit_card
            );
        }
    }

    async deleteDriver(driverId: string): Promise<void> {
        Driver.findOneAndDelete({ _id: driverId });
    }
}

export const driverService = new DriverService();
