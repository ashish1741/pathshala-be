import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/ctachAsyncError";
import ErrorHandler from "../utilis/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.services ";

//upload course

export const uploadCourse = catchAsyncError(
    async ( req: Request, res:Response, next: NextFunction) => {
        try {
            console.log('run try block');
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
