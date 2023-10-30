import {app} from "./app";
import connectDB from "./utilis/db";
import {v2 as cloudinary} from "cloudinary"


// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRETE

})

//create server
app.listen(3000, () =>{
    console.log(`server is live `);
    connectDB();
});


