import { NextFunction, Request, Response } from "express";

// Only users with the role "buyer" can access the route
export const allowBuyerOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "buyer") {
    return res.status(403).json({
      message: "Only buyers can trigger this operation",
    });
  }
  next();
};

// Only users with the role "seller" can access the route
export const allowSellerOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "seller") {
    return res.status(403).json({
      message: "Only sellers can trigger this operation",
    });
  }
  next();
};
