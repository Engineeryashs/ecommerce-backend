/*function adminMiddleware(req,res,next){
    const isAdmin=req.user;
        if(isAdmin.role==="admin"){
     console.log("I am admin user")
       next();
    }
    else{
        res.status(403).json({
            msg:"Permissions forbidden"
        })
    }
}
module.exports=adminMiddleware;
Slightly better approach is given below
*/
function adminMiddleware(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            msg: "Access denied. Admin only."
        });
    }
    next();
}

module.exports = adminMiddleware;

