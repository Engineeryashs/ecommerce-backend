const express=require("express");
require("dotenv").config();
const connectDB=require("./db/config");
const mainRouter=require("./routers/mainRouter");

//App config
const app=express();
const port=3000||process.env.PORT;

//Middlewares
app.use(express.json());
connectDB();
console.log("Router loaded index")
app.use("/api/v1",mainRouter);
app.listen(port,()=>{
    console.log(`Listening on the port ${port}`)
})