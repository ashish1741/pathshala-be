require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {ErrorMiddleware} from "./middleware/error";
import userRouter from "./routes/user.route";
import { activateUser } from "./controllers/user.controllers";

export const app = express();
//body parser

app.use(express.json({ limit: "50mb" }));
app.set('view engine', 'ejs')

//cookie parser
app.use(cookieParser());

//cors
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);


//route
app.use("/api/v1",userRouter)

//testing API

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    succcess: true,
    message: `API is working`,
  });
});



// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
  console.log(err);
});



app.use(ErrorMiddleware)