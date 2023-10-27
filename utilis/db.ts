import  mongoose  from "mongoose";
 require('dotenv').config();

const db_url:string = process.env.DB_URL || ''; 

const connectDB =async () => {
    try {
        await mongoose.connect(db_url).then((data:any)=>{
            console.log('database is connected ');
            
        })
        
    } catch (error:any) {
        console.log(error.message);
        setTimeout(connectDB,5000);
        
        
    }
    
}

export default connectDB