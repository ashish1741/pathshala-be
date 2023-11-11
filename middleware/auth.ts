import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "./ctachAsyncError";
import ErrorHandler from "../utilis/ErrorHandler";
import jwt,{JwtPayload} from "jsonwebtoken";
import { redis } from "../utilis/redis";

export const isAutheticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
      return next(
        new ErrorHandler("please login to access this resource", 400)
      );
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string) as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandler("acess token is not valid", 400));
    }
      const user = await redis.get(decoded.id)
    if (!user) {
      return next(new ErrorHandler("user not found", 400));
    }

    
    
    req.user  = JSON.parse(user);
    next();
  }
);


//validate user role 3.23.00

export const authorizeRoles = (...roles:string[]) =>{
  return(req:Request,res:Response,next:NextFunction) =>{
    if (!roles.includes(req.user?.role || '')) {
      return next(new ErrorHandler(`Role:${req.user?.role} is not allowed to access this resources`, 400))  
    }
    next()
  }
}

