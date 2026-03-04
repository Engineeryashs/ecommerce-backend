const express=require("express");
const Order=require("../db/models/Order");
const authMiddleware = require("../middlewares/authMiddleware");
const Cart = require("../db/models/Cart");
const Product = require("../db/models/Products");

/*So what we want is to place the order ideally we will get the method of payment from frontend
we will use it and then do payment accordingly before payment we will create order*/

router.post("/checkOut",authMiddleware,async(req,res)=>{
    const {paymentMethod}=req.body;
    const {name,lastName,email,street,city,zipcode,country,state,phone}=req.body;
    const userId=req.user.userId;
    try {
            //Hum log cart ko pehle fetch karege qki hum cart s data lege
          const cartData=await Cart.findOne({
            user:userId
          })
          if(!cartData){
            return res.status(403).json({
                msg:"No cart is there"
            })
          }
          //Check karo ki yeh paymentOptions h ya nahi
          if(!["COD","Razorpay","Stripe"].includes(paymentMethod))
          {
            return res.status(403).json({
                msg:"It does not contains any valid payment options"
            })
          }
          //items array uske andar ka jo bhi hoga woh cart se fetch karo
          const orders=[];
           const Product=await Product.fin
          for(let i of cartData.items)
          {
            orders.push({
              productId:i.productId,
              quantity:i.quantity,
              size:i.size,
              price:Product.prices
            })
           

          }
        if(paymentMethod=="COD"){
         
          const order=await Order.create({
            user:userId,
            items:orders,
            totalPrices:1,
            deliveryInformation:{
                name:name,
                lastName:lastName,
                email:email,
                street:street,
                city:city,
                zipcode:zipcode,
                country:country,
                state:state,
                phone:phone
            },
            paymentMethod:paymentMethod,
            paymentStatus:"pending",
            orderPlaced:"Order Placed"
          })

          await Cart.findOneAndDelete({
            user:userId
          })
          //Order create karo pehle fir payment karo
          //update the stock too
          //delete kardo cart 
          //order delete nahi kar skte hum  
        }
        if(paymentMethod=="Razorpay"){

        }
        if(paymentMethod=="Stripe"){

        }

    } catch (error) {
        
    }
})