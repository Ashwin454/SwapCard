const user=require("../models/usermodel");
const jwt=require('jsonwebtoken');
exports.isAuthenticated=async(req, res, next)=>{
    try{
        const token=req.cookies.token;
        if(token==null){
            return res.status(400).json({
                success:false,
                message:"Not Logged in currently"
            })
        }
        const decodedData=jwt.verify(token, "sldnjfliashgiupahnvipdsnvpiuad");
        const user1=await user.findOne({email: decodedData.email});
        req.user=user1;
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message
        })
    }
}