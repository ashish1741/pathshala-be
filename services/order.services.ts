import { Response,Request,NextFunction } from "express";
import CourseModel from "../models/course.model";
import { catchAsyncError } from "../middleware/ctachAsyncError";


//create new order

export const newOrderService  = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    
})