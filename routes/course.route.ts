import express from "express";
import { uploadCourse } from "../controllers/course.controllers";
import { isAutheticated } from "../middleware/auth";
const courseRouter = express.Router();

courseRouter.post("/create-course", isAutheticated, uploadCourse);

export default courseRouter;
