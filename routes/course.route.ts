import express from "express";
import { editCourse, uploadCourse } from "../controllers/course.controllers";
import { isAutheticated } from "../middleware/auth";
const courseRouter = express.Router();

courseRouter.post("/create-course", isAutheticated, uploadCourse);
courseRouter.put("/edit-course/:id", isAutheticated, editCourse);

export default courseRouter;
