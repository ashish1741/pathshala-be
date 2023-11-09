import express from 'express';
import { isAutheticated } from '../middleware/auth';
import { getNotifications, updateNotification } from '../controllers/notification.controllers';

const notificationRouter = express.Router();

notificationRouter.get("/get-notification", isAutheticated, getNotifications );
// notificationRoute.get("/get-notification", isAutheticated, authorizeRole('admin') getNotifications, )

notificationRouter.put("/update-notification/:id", isAutheticated,updateNotification)
// notificationRouter.put("/update-notification/:id", isAutheticated, authorizeRole('admin'), updateNotification)

 

export default notificationRouter
