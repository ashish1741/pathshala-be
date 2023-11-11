import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utilis/ErrorHandler";
import { catchAsyncError } from "../middleware/ctachAsyncError";
import { generateLast12MonthData } from "../utilis/analytics.generator";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

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
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );

  // get course analytics --- only admin

export const getCourseAnalytics = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log(`try block nun`);
        const course = await generateLast12MonthData(CourseModel);
  
        res.status(200).json({
          success: true,
          course
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );

    // get order analytics --- only admin
  
export const getOrderAnalytics = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log(`try block nun`);
        const orders = await generateLast12MonthData(OrderModel);
  
        res.status(200).json({
          success: true,
          orders
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );
  
