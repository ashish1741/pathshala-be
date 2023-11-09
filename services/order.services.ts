import { Response,Request,NextFunction } from "express";
import { catchAsyncError } from "../middleware/ctachAsyncError";
import OrderModel from "../models/order.model";


//create new order

export const newOrder = catchAsyncError(async(data:any,res:Response,next:NextFunction)=>{
    console.log(data);
    console.log(`order service function is called`);
    
    const order =  await  OrderModel.create(data);
    console.log(order);
    
   
    

    res.status(201).json({
        success:true,
        order,

    })



 

})