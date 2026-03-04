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
    },//Here I kept subcategory as string not an array of string as I thinks subcategory will be different for myecommerce app
    subcategory:{
        type:String,
        required:true
    },
    variants:[{
    size:{
        type:String,
        required:true,
        enum: ["S", "M", "L", "XL", "XXL"]
    },
    stock:{
        type:Number,
        min:0,
        required:true
    },
    prices:{
        type:Number,
        required:true,
        min:0
    },
    }],
    minPrice:{
        type:Number,
        required:true,
        min:0  //Hey we will use this minPrice to sort db using minPrice and we will calculate this minPrice while product creation or variant updation
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