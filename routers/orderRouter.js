const express = require("express");
const router = express.Router();
const Order = require("../db/models/Order");
const authMiddleware = require("../middlewares/authMiddleware");
const Cart = require("../db/models/Cart");
const Product = require("../db/models/Products");
const  mongoose = require("mongoose");

/*So what we want is to place the order ideally we will get the method of payment from frontend
we will use it and then do payment accordingly before payment we will create order*/

router.post("/checkOut", authMiddleware, async (req, res) => {
    const { paymentMethod } = req.body;
    const { name, lastName, email, street, city, zipcode, country, state, phone } = req.body;
    let session=mongoose.startSession();
    const userId = req.user.userId;
    try {
        //Hum log cart ko pehle fetch karege qki hum cart s data lege
        
        await session.startTransaction();
        const cartData = await Cart.findOne({
            user: userId
        }).session(session);

        if (!cartData || cartData.items.length == 0) {
            await session.abortTransaction();
            return res.status(403).json({
                msg: "No cart is there"
            })
        }

        //Check karo ki yeh paymentOptions h ya nahi
        if (!["COD", "Razorpay", "Stripe"].includes(paymentMethod)) {
            await session.abortTransaction();
            return res.status(403).json({
                msg: "It does not contains any valid payment options"
            })
        }

        //items array uske andar ka jo bhi hoga woh cart se fetch karo
        const orders = [];
        let totalPrices=0;
        for (let i of cartData.items) {
            const Products = await Product.findById(i.productId).session(session);
            if (!Products) {
                await session.abortTransaction();
                return res.status(404).json({ msg: "Product not found" });
            }
            const variants = Products.variants;
            //find in array returns the whole element
            const selectedSize = variants.find(v => v.size === i.size) //returns the first matched size
            if (!selectedSize) {
                await session.abortTransaction();
                return res.status(400).json({ msg: "Invalid size selected" });
            }
            //humko pehle check karna padega bhaiya ki given cheez ka stock hai bhi ya nahi
            if(i.quantity>selectedSize.stock){
                await session.abortTransaction();
                return res.status(409).json({
                    msg:"Out of stock"
                })
            }
            orders.push({
                productId: i.productId,
                quantity: i.quantity,
                size: i.size,
                price: selectedSize.prices
            })
            totalPrices=totalPrices+i.quantity*selectedSize.prices;
            //Updating the stock here
            selectedSize.stock=selectedSize.stock-i.quantity;
            await Products.save({session});
        
        }
        //then we will create order after payment
        if (paymentMethod == "COD") {

            const order = await Order.create({
                user: userId,
                items: orders,
                totalPrices: totalPrices,
                deliveryInformation: {
                    name: name,
                    lastName: lastName,
                    email: email,
                    street: street,
                    city: city,
                    zipcode: zipcode,
                    country: country,
                    state: state,
                    phone: phone
                },
                paymentMethod: paymentMethod,
                paymentStatus: "Pending",
                orderPlaced: "Order Placed"
            },{session});
              
            await Cart.findOneAndDelete({
                user: userId
            }).session(session)
             
            await session.commitTransaction();
            session.endSession();

            res.json({
                msg: "Order placed successfully",
                orderId: order
            })
            //Order create karo pehle fir payment karo
            //update the stock too
            //delete kardo cart 
            //order delete nahi kar skte hum  
        }
        /*
        if(paymentMethod=="Razorpay"){

        }
        if(paymentMethod=="Stripe"){

        }
*/
    } catch (error) {
        console.log(error);
         await session.abortTransaction();
         session.endSession();
           res.status(500).json({
            error:error,
            msg:"Internal Server Error"
           })
    }
})

module.exports=router;