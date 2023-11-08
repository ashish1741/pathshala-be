import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/ctachAsyncError";
import ErrorHandler from "../utilis/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.services ";
import CourseModel from "../models/course.model";
import { redis } from "../utilis/redis";
import mongoose, { Types } from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utilis/sendMail";

//upload course

export const uploadCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    console.log(`dqllll`);
    
    try {
      console.log(`try block run`);
      
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
      console.log(`${next(new ErrorHandler(error.message, 500))}`);
      
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get single course ----- without  purchasing

export const getSingleCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = await req.params.id;
      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(courseId).select(
          "-courseData.suggestion -courseData.question -courseData.links -courseData.videoUrl"
        );
        await redis.set(courseId, JSON.stringify(course));

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get all courses ----witout pursing

export const getAllCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allCourses");
      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);

        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.find().select(
          "-courseData.suggestion  -courseData.question -courseData.links -courseData.videoUrl"
        );
        await redis.set("allCourses", JSON.stringify(course));

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get course content --- only valid user

export const getCourseContent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseID = req.params.id;
      const courseExist = userCourseList?.find(
        (course: any) => course._id.toString() === courseID
      );

      if (!courseExist) {
        return next(
          new ErrorHandler("You are not able to access this course ", 400)
        );
      }

      const course = await CourseModel.findById(courseID);
      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add question in course

interface IAddQuestionOnData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionOnData = req.body;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      // create a new question object

      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      //add this question to our course content
      courseContent?.question.push(newQuestion);

      //save the update about question
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add anwser in course question

interface IAddAnswerData {
  anwser: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('run try block');
      
      const { anwser, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      const course = await CourseModel.findById(courseId);
      

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
        
      );


      if (!courseContent) {
        console.log('run invalid user');
        
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const question = courseContent?.question?.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!question) {
        console.log(`question not found:`);
        
        return next(new ErrorHandler("question not found", 400));
      }

      //create a new answer objects
      const newAnswer:any = {
        user: req.user,
        anwser,
      };

      //add answer to the replies
      question.questionReplies.push(newAnswer);
      await course?.save();

     //
      if (req.user?._id === question.user._id) {
        // create notification
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/replay-answer.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.name,
            subject: "Question Reply",
            template: "reply-answer",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


// add review on the course

interface IAddReview {
  review: string;
  rating:Number;
  userId : string;
}

export const addReview = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    
     const userCourseList  = req.user?.courses;
     const courseID  = req.params.id;
    

     const courseExist =  userCourseList?.some((course:any)=>course._id.toString()===courseID.toString());
     if (!courseExist) {
      console.log(`${ next(new ErrorHandler('You are not eligibal to access this course',400))}`);
      
      return next(new ErrorHandler('You are not eligibal to access this course',400))
     }

     const course = await CourseModel.findById(courseID);

     const { review,rating } = req.body as IAddReview;

     const reviewData:any = {
      user:req.user,
      rating,
      Comment:review,

     };

      course?.reviews.push(reviewData)
    
      let avg = 0;

      course?.reviews.forEach((rev:any)=>{
        avg += rev.rating;
      });

      if (course) {
        course.ratings = avg / course.reviews.length
        
      }

      await course?.save();

      const notification  = {
        title:"New Review Received",
        message:`${req.user?.name} has given a review in a ${course?.name}`
      }


      res.status(200).json({
        success : true,
        course,
      });
       



  } catch (error: any) {
    console.log(`${next(new ErrorHandler(error.message, 500))}`);
    return next(new ErrorHandler(error.message, 500));
  }


})



