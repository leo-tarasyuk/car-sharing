import { Request, Response } from "express";
import { Types } from "mongoose";

import { Driver } from "../models/driver.model";
import { Card } from "../models/card.model";

import { IDriver } from "../config/driver.config";

/**
 * Controller for creating driver
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const postDriverHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  await Driver.createCollection();
  await Card.createCollection();

  const { license_number, first_name, last_name, credit_card }: IDriver =
    req.body;
  let credit_card_id = null;

  const reqCreditCard = credit_card?.number
    ? await Card.findOne({ number: credit_card.number })
    : null;

  if (reqCreditCard) {
    credit_card_id = reqCreditCard;
  } else {
    const newCreditCard = new Card(credit_card);
    await newCreditCard.save();
    credit_card_id = newCreditCard._id;
  }

  const driver = await Driver.findOne({
    license_number: license_number,
  });

  if (driver) {
    res.send("Error: Driver was created");
  } else {
    const newDriver = new Driver({
      license_number,
      first_name,
      last_name,
      credit_card_id,
    });
    newDriver.save().then(() => res.send("Driver is created"));
  }
};

/**
 * Controller for getting driver
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const getDriverHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const driverId: Types.ObjectId | string = req.params.driverId;

  Driver.aggregate([
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
      $unwind: "$credit_card",
    },
    {
      $unset: ["credit_card_id"],
    },
  ])
    .then((drivers) => res.send(drivers[0]))
    .catch(() => res.send(`Can't find this driver`));
};

/**
 * Controller for change params in driver
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const putDriverHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const driver: IDriver = req.body;

  Driver.findOneAndUpdate({ _id: driver._id }, driver)
    .then(() => {
      if (driver.credit_card?._id)
        Card.findOneAndUpdate(
          { _id: driver.credit_card._id },
          driver.credit_card
        );
    })
    .then(() => res.send(`Driver was updated`))
    .catch(() => res.send(`You can't update this driver`));
};

/**
 * Controller for deleting driver
 *
 * @param {Request} req Request param
 * @param {Response} res Response param
 * @return {Promise<void>}
 */
export const deleteDriverHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const driverId: Types.ObjectId | string = req.params.driverId;

  Driver.findOneAndDelete({ _id: driverId })
    .then(() => res.send(`Driver was deleted`))
    .catch(() => res.send(`Driver ${driverId} is not found`));
};
