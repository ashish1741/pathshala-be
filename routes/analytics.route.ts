import express from "express";
import { isAutheticated } from "../middleware/auth";
import { getUserAnalytics } from "../controllers/analytics.controllers";

const analyticsRouter = express.Router()

// analyticsRouter.get("/get-users-analytics", isAutheticated, authorizedRoles("admin"), getUserAnalytics )
analyticsRouter.get("/get-users-analytics", isAutheticated,  getUserAnalytics );

export default analyticsRouter;