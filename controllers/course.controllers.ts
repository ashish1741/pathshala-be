import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/ctachAsyncError";
import ErrorHandler from "../utilis/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.services ";
import CourseModel from "../models/course.model";
import { redis } from "../utilis/redis";

//upload course

export const uploadCourse = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("run try block");
            console.log(req.body);

            const data = req.body;
            const thumbnail = data.thumbnail;
            if (thumbnail) {
                const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                    folder: "courses",
                });

                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }

            createCourse(data, res, next);
        } catch (error: any) {
            console.log(`${next(new ErrorHandler(error.message, 400))}`);

            return next(new ErrorHandler(error.message, 400));
        }
    }
);

//edit course

export const editCourse = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const thumbnail = data.thumbnail;
            if (thumbnail) {
                await cloudinary.v2.uploader.destroy(thumbnail.public_id);
                const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                    folder: "courses",
                });

                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }

            const courseId = req.params.id;

            const course = await CourseModel.findByIdAndUpdate(
                courseId,
                {
                    $set: data,
                },
                { new: true }
            );
            res.status(201).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//get single course ----- without  purchasing

export const getSingleCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = await req.params.id;
        const isCacheExist = await redis.get(courseId);

        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                course
            })
        }
        else {

            const course = await CourseModel.findById(courseId).select("-courseData.suggestion -courseData.question -courseData.links -courseData.videoUrl");
            await redis.set(courseId, JSON.stringify(course))

            res.status(200).json({
                success: true,
                course
            })
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})


//get all courses ----witout pursing

export const getAllCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const isCacheExist = await redis.get("allCourses");

        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);

            res.status(200).json({
                success: true,
                course

            });
        }
        else {
            const course = await CourseModel.find().select(
                "-courseData.suggestion  -courseData.question -courseData.links -courseData.videoUrl");
            await redis.set('allCourses', JSON.stringify(course));

            res.status(200).json({
                success: true,
                course
            });

        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})


//get course content --- only valid user


export const getCourseContent = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {

        const userCourseList = req.user?.courses;
        const courseID = req.params.id;
        const courseExist =  userCourseList?.find((course:any)=>course._id.toString()===courseID);
        
        

        if (!courseExist) {
            console.log(`running`);
            
            return next(new ErrorHandler('You are not able to access this course ',400));            
        };

        const course = await CourseModel.findById(courseID);
        const content = course?.courseData;

        console.log(content);
        

        res.status(200).json({
            success:true,
            content,

        })



        
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})
