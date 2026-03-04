const express=require("express");
const userRouter=require("./userRouter");
const productRouter=require("./productRouter");
const cartRouter=require("./cartRouter");
const router=express.Router();
//Router.use("/admin",adminRouter);
console.log("Main router loaded...")
router.use("/user",userRouter);
router.use("/products",productRouter);
router.use("/carts",cartRouter);

module.exports=router;