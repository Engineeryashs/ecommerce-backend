const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["user","admin"], //here we are using enum validator of mongoose so that if there is anything oother than this two values it will not allow
        default:"user"
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    }
})
const User=mongoose.model("User",userSchema);
module.exports=User;