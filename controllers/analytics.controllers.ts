import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utilis/ErrorHandler";
import { catchAsyncError } from "../middleware/ctachAsyncError";
import { generateLast12MonthData } from "../utilis/analytics.generator";
import userModel from "../models/user.model";

// get users analytics --- only

export const getUserAnalytics = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log(`try block nun`);
        const users = await generateLast12MonthData(userModel);
  
        res.status(200).json({
          success: true,
          users
        });
      } catch (error: any) {
        console.log(`${next(new ErrorHandler(error.message, 500))}`);
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );
  
