const mongoose=require("mongoose");
const productSchema =new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:[String],
        required:true
    },
    subcategory:{
        type:[String],
        required:true
    },
     size:{
        type:[String],
        required:true
    },
    prices:{
        type:Number,
        required:true
    },
    bestSeller:{
        type:Boolean,
        required:true
    },
    images:{
        type:[String],
        required:true
    },
    rating:{
        type:Number,
        default:0,
        min:0,
        max:5
    }
})

const Product=mongoose.model("Product",productSchema);
module.exports=Product;