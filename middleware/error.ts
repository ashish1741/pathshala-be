import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utilis/ErrorHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handle specific errors
  if (err.name === "CastError") {
    const message = `Resource Not Found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  } else if (err.code === 11000) {
    const message = `Duplicate Key Error`;
    err = new ErrorHandler(message, 11000);
  } else if (err.name === "JsonWebTokenError") {
    const message = `Invalid JWT`;
    err = new ErrorHandler(message, 401);
  } else if (err.name === "TokenExpiredError") {
    const message = `JWT Expired`;
    err = new ErrorHandler(message, 401);
  }

  // Send JSON response
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
