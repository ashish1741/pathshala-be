import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/ctachAsyncError";
import ErrorHandler from "../utilis/ErrorHandler";
import OrderModel,{IOrder} from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs"
import sendMail from "../utilis/sendMail";
import NotificationModel from "../models/notification.model";

//create order

export const createOrder = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {

        const {courseId,payment_info}  = req.body as IOrder;
        const user = await userModel.findById(req.user?._id);

        //searching that user either already enroll the course or not
        const courseExistInUser = user?.courses.some((course:any)=> course._id.toString()===courseId);

        if (courseExistInUser) {
            return next(new ErrorHandler('You have already enrolled in this course',400))
            
        }

        const  course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler('course does not found',400));
            
        }

        const data:any = {
            course_Id : course._id,
            userId:user?.id,
        };

        
  



        
    } catch (error) {
        
    }
})


