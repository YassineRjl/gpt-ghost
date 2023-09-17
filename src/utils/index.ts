import { PrismaClient } from "@prisma/client";
import { CorsOptions } from "cors";
import { Request } from "express";

// Constants
export const VALID_COINS = [100, 50, 20, 10, 5];

// Prisma client
export const prisma = new PrismaClient();

// CORS
const WHITELIST = ["http://example1.com", "http://localhost:3000"];
export const corsOptionsDelegate = function (
  req: Request,
  callback: (err: Error | null, options?: CorsOptions) => void
) {
  var corsOptions;
  if (WHITELIST.indexOf(req.headers.origin ?? "") !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

// for tests
export const makeid = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
