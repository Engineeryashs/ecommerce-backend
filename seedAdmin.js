const mongoose=require("mongoose");
require("dotenv").config();
const User=require("./db/models/User");
const { genSalt, hash } = require("bcrypt");


/*
const app=express();
app.use(express.json());

app.post("/seedAdmin",(req,res)=>{
   const isAdmin=User.findOne({
    email:
   }) 
})
   So I won't make router here as router is publicly accessible so that's why I will make
   an function and I will call that function here only.
*/

const seedAdmin=async()=>{
    //At first we will connect to the database then 
    await mongoose.connect(process.env.MONGODB_URI);
    //Check whether there is an existing admin or not
    try {
         const isAdmin=await User.findOne({
        email:process.env.ADMIN_USERNAME,
        role:"admin"
    });
    if(isAdmin){
        console.log("Admin is already there");
        process.exit(0);
    }
    /*If not then try to create Admin using this seedAdmin function and then call 
    this function whenever you will call node seedAdmin.js and run this script it 
    will automatically create an superAdmin for you this will manage all the products
    in this application */
    //Before creating admin let's hash his password
    const salt=await genSalt(10);
    const hashedPassword=await hash(process.env.ADMIN_PASSWORD,salt);
    const adminUser=await User.create({
        name:process.env.ADMIN_NAME,
        email:process.env.ADMIN_USERNAME,
        password:hashedPassword,
        role:"admin"
    });
    console.log(adminUser);

    } catch (error) {
        console.log(error);
    }
}
seedAdmin();

