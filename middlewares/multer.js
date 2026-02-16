const multer=require("multer");
//Here this multer middleware is used to parse the files from front-end to req.file in the request object
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,"./uploads");
    },
    filename:function(req,file,cb){
      return cb(null,Date.now()+file.originalname);
    }
})
const upload=multer({storage});

module.exports=upload;