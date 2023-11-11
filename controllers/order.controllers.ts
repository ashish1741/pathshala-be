import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/ctachAsyncError";
import ErrorHandler from "../utilis/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utilis/sendMail";
import NotificationModel from "../models/notification.model";
import { getAllOrderService, newOrder } from "../services/order.services";

//create order

export const createOrder = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {

    try {

      const { courseId, payment_info } = req.body as IOrder;
      const user = await userModel.findById(req.user?._id);

      //searching that user either already enroll the course or not
      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExistInUser) {
        return next(new ErrorHandler("You have already enrolled in this course", 400));
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("course does not found", 400));
      }

      const data: any = {
        courseId: course._id,
        userId: user?.id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confiramtion.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confiramtion.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user?.courses.push(course?._id);
      await user?.save();

      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `you have a new order from ${course?.name}`,
      });

      await course.save();

      newOrder(data, res, next);


    }
    
    catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all order -- only admin

export const getAllOrders = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrderService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
