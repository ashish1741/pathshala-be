import { NextFunction, Request, Response } from "express";
import NotificationModel from "../models/notification.model";
import { catchAsyncError } from "../middleware/ctachAsyncError";
import ErrorHandler from "../utilis/ErrorHandler";
import corn from "node-cron";

export const getNotifications = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        notification,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//update notification status

export const updateNotification = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.findById(req.params.id);

      if (!notification) {
        console.log(`${next(new ErrorHandler("Notification not found", 404))}`);
        return next(new ErrorHandler("Notification not found", 404));
      } else {
        notification.status
          ? (notification.status = "read")
          : notification?.status;
      }

      await notification.save();
      const notifications = await NotificationModel.find().sort({
        createAt: -1,
      });

      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      console.log(`${next(new ErrorHandler(error.message, 500))}`);

      return next(new ErrorHandler(error.message, 500));
    }
  }
);


//delete notification

corn.schedule('0 0 0 * * *', async() =>{
    const thirtyDayData = new Date(Date.now()-30*24*60*60);
    await NotificationModel.deleteMany({status:"read", createdAt:{$lt:thirtyDayData}});
    console.log(`Deleted read notification`);
      
})


