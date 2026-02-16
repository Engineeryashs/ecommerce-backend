const jwt=require("jsonwebtoken");

function authMiddleware(req,res,next){
    //check if its user or not so for doing this
    const authHeader=req.headers['authorization'];
    if(!authHeader||!authHeader.startsWith("Bearer ")){
        return res.status(403).json({
            msg:"Unauthenticated due to token missing"
        })
    }
        try {
             const token=authHeader.split(" ")[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        req.user=decoded;
        next();
            
        } catch (error) {
            console.log(error);
            res.status(403).json({
                msg:"Invalid or expired token"
            })
        }
}
module.exports=authMiddleware;