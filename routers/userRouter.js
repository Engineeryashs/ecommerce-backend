const express = require("express");
const router = express.Router();
const User = require("../db/models/User");
const { userSignupSchema, userSigninSchema } = require("../types/types");
const { genSalt, hash, compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
console.log("User router loaded")
router.post("/signup", async (req, res) => {
    /* Sabse pehle yeh check karo ki given input type jo aaya hai request k jariye
    woh usko validate karo woh sahi bhi ha.
    i ya nahi hai through zod typescript based validations */
    const parsedData = userSignupSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            msg: "Invalid data type"
        })
    }
    const { name, email, password } = parsedData.data;
    /* check karo ki kya database m woh model h kya toh check it using
     email*/
    try {
        const isUser = await User.findOne({ email: email });
        if (!isUser) {
            const salt = await genSalt(10);

            const hashedPassword = await hash(password, salt);
            const newUser = await User.create({
                name: name,
                email: email,
                password: hashedPassword
            })
            const token = jwt.sign({
                userId:newUser._id,
                email: email,
                role: newUser.role
            }, JWT_SECRET)

            return res.json({
                msg: "User created successfully",
                userName: newUser.email,
                token: token
            })
        }
        res.status(409).json({
            msg: "User is already registered"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }

})

router.post("/signin", async (req, res) => {
    //Check if there is email or not in that User module then
    //compare the hashedpassword with the current password if both are same then signin
   
    const parsedData = userSigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            msg: "Invalid data type"
        })
    }
   
   const {  email, password } = parsedData.data;
   try {
     const isUser = await User.findOne({ email: email })
    if (!isUser) {
        return res.status(403).json({
            msg: "User not found"
        })
    }
    const isMatching = await compare(password, isUser.password);
    console.log(isMatching);
    if (!isMatching) {
        return res.status(403).json({
            msg: "Passwords does not match, Invalid credentials"
        })
    }
  
    const token=jwt.sign({
        userId:isUser._id,
        email:isUser.email,
        role:isUser.role
    },JWT_SECRET);
    res.json({
        msg: "Logged in successful",
        token:token
    })

   } catch (error) {
    res.status(500).json({
        msg:"Internal Server Error"
    })
   }
})




module.exports = router;