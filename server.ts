import {app} from "./app";
import connectDB from "./utilis/db";

//create server
app.listen(3000, () =>{
    console.log(`server is live `);
    connectDB();
});


