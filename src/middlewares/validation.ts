import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// used mainly during the creation of the resource.
// it makes sense to validate every route instead of just the creation process
// but for the sake of the time constraints and to submit this project this weekend as requested, I demonstrated it here
// Happy to discuss this further

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("buyer", "seller").required(),
  }).validate(req.body);

  if (result.error) {
    return res.status(400).json({ message: result.error.details[0].message });
  }

  next();
};

export const validateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = Joi.object({
    amountAvailable: Joi.number().required(),
    cost: Joi.number().required(),
    productName: Joi.string().required(),
  }).validate(req.body);

  if (result.error) {
    return res.status(400).json({ message: result.error.details[0].message });
  }

  next();
};
