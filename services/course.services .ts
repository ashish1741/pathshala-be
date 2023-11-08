import { Response,Request,NextFunction } from "express";
import CourseModel from "../models/course.model";
import { catchAsyncError } from "../middleware/ctachAsyncError";

//create course  

export const createCourse = catchAsyncError(async( data:any,res:Response)=>{
  console.log('create course is called');
  

  const course = await CourseModel.create(data);
  console.log(course);
  

  res.status(201).json({
    success:true,
    course
  })

})