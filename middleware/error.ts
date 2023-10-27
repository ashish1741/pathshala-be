import ErrorHandler from "../utilis/ErrorHandler";
import { NextFunction, Request, Response } from "express";

export const ErrorMiddleware = (
  err:any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.message    = err.message || "Internet Server Error";

//   //wrong mongob id error

  if (err.name === "CastError") {
    const message = `Resource Not Found . Invalid :${err.path} `;
    err = new ErrorHandler(message, 400);
  }

//   // dulipacte key error
  if (err.name === 11000) {
    const message = `Resource Not Found . Invalid :${err.path} `;
    err = new ErrorHandler(message, 11000);
  }

//   //wrong Jwt error
  if (err.name === "jsonWebTokenError") {
    const message = `Resource Not Found . Invalid :${err.path} `;
    err = new ErrorHandler(message, 11000);
  }

//   //jwt expire error

  if (err.name === "TokenExpiredError") {
    const message = `Resource Not Found . Invalid :${err.path} `;
    err = new ErrorHandler(message, 11000);
  }
};
