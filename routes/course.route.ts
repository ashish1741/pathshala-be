import express from "express";
import { editCourse, getAllCourse, getCourseContent, getSingleCourse, uploadCourse } from "../controllers/course.controllers";
import { isAutheticated } from "../middleware/auth";
const courseRouter = express.Router();

courseRouter.post("/create-course", isAutheticated, uploadCourse);
courseRouter.put("/edit-course/:id", isAutheticated, editCourse);
courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllCourse);
courseRouter.get("/course-content/:id",isAutheticated, getCourseContent);

export default courseRouter;
