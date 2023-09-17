import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserClass } from "../models/user";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Auth Error: No token provided." });
  }
  try {
    // verify the token then retrieve the user
    const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as Pick<
      User,
      "id"
    >;
    const user = await UserClass.findById(id);
    if (!user)
      return res.status(401).json({ message: "Auth Error: Invalid token." });

    // attach the user to be accessible for the next handlers
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
};
