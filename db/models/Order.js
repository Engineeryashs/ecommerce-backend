//Sabse pehle hum log ek Order model banayege
//A user can have many orders but an order will have only one user assosciated with it
const mongoose=require("mongoose");
const { required } = require("zod/mini");
/*Since price keeps changing so we are using orderSchema and fetching price from
the products directly we will not fetch price from the cart because price keeps changing*/
const orderSchema=new mongoose.Schema({
user:{
    type:mongoose.Types.ObjectId,
    ref:"User"
},
 items: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            min: 1,            
            default: 1
        },
        size:{
            type:String
        },
        price: {
            type: Number,
            required:true
        }
    }],
    totalPrices:{
        type:Number,
        min:0
    },
    deliveryInformation:{
        name:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        email:{
        type:String,
        required:true,
        lowercase:true
        },
        street:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        zipcode:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        }
    },
    paymentMethod:{
        type:String,
        enum: ["COD", "Razorpay","Stripe"],
        default:"COD",
        required:true
    },
    paymentStatus:{
        type:String,
        enum:["Success","Failed","Pending","Refunded"],
        default:"Success"
    },
    orderStatus:{
        type:String,
        enum:["Order Placed","Shipped","Packing","Delivered","Out of delivery"],
        default:"Order Placed"
    }
})