import express from "express";
import { isAutheticated } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/order.controllers";

const orderRouter = express.Router();

orderRouter.post("/create-order" ,  isAutheticated , createOrder);
orderRouter.get("/get-all-order" ,  isAutheticated , getAllOrders);


export default orderRouter;

