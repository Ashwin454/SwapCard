const user=require("../models/usermodel")
const bcrypt=require("bcryptjs");
const JWT=require("jsonwebtoken");
const qrcode=require("qrcode");
const cookieParser=require("cookie-parser");
const dotenv=require("dotenv");
const mongoose = require("mongoose");
exports.registerUser=async(req, res, next)=>{
    try{
        const {name, email, phone, password}=req.body;
        if(!name || !email || !phone || !password){
            return res.status(400).json({
                message:"Give complete Data"
            })
        }
        const hashedPass=await bcrypt.hash(password, 10);
        const user1=await user.create({
            name,
            email,
            phone,
            password:hashedPass
        });
        const token=await JWT.sign({id: user1._id, email: user1.email},"sldnjfliashgiupahnvipdsnvpiuad" , {expiresIn: '200h'});
        const option={
            httpOnly:true,
            expires:new Date(Date.now() + 200*60*60*1000)
        }
        req.user=user1;
        return res.status(200).cookie('token',token, option).json({
            success:true,
            user1,
            token:token
        })
    }catch(error){
        console.log("Some error occured.");
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"Internal Server error"
        })
    }
}
exports.loginUser=async(req, res, next)=>{
    try{

        const {email, password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Enter complete data."
            })
        }
        const user1=await user.findOne({
            email:email
        })
        if(!user1){
            return res.status(400).json({
                success:false,
                message:"User doesn't exists"
            })
        }
        const comp=await bcrypt.compare(password, user1.password);
        if(!comp){
            return res.status(400).json({
                success:false,
                message:"Incorrect Password"
            })
        }
        const token=JWT.sign({id:user1._id, email:user1.email}, "sldnjfliashgiupahnvipdsnvpiuad", {expiresIn: '200h'} );
        const option={
            httpOnly:true,
            expires:new Date(Date.now() + 200*60*60*1000)
        }
        req.user=user1;
        return res.status(200).cookie('token', token, option).json({
            success:true,
            user1,
            token
        })
    }catch(err){
        return res.status(500).json({
            success:true,
            message:"Internal Server error: "+err.message
        })
    }
}
exports.logoutUser=async(req, res, next)=>{
    try{
        res.cookie('token', null, {
            httpOnly:true,
            expiresIn:new Date(Date.now())
        })
        return res.status(200).json({
            success:true,
            message:"Logged Out successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}
exports.loadUser=async(req, res, next)=>{
    try{
        const user1=req.user;
        if(!user1){
            return res.status(400).json({
                success:false,
                message:"Currently not logged in"
            })
        }
        return res.status(200).json({
            success:true,
            user1
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal sever error", error
        })
    }
}
exports.updateProf=async(req, res, next)=>{
    try{
        const user1=req.user;
        const user2=await user.findByIdAndUpdate(user1.id , req.body , {
            new:true,
            runValidators:true,
            userFindAndModify:false
        })
        await user1.save();
        req.user=user2;
        return res.status(200).json({
            success:true,
            user2
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}
exports.generateQR=async(req, res, next)=>{
    try{
        const data=req.params.id;
        const user1=await user.findById(data);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User doesn't exists"
            })
        }
        const qrCodedata=JSON.stringify({id:data});
        const qrcodeurl=await qrcode.toDataURL(qrCodedata);
        user1.qrcodeurl=qrcodeurl;
        await user1.save();
        return res.status(200).json({
            user1
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
exports.invite=async(req, res, next)=>{
    try{
        const senderID=req.body.sendersID;
        const recieverID=req.body.recieversID;
        const sender=await user.findById(senderID);
        const reciever=await user.findById(recieverID);
        console.log(senderID);
        console.log(recieverID);
        if(!sender || !reciever){
            return res.status(400).json({
                success:false,
                message:"User doesn't exists"
            })
        }
        sender.pendingList.push(recieverID);
        await sender.save();
        const user1=sender;
        return res.status(200).json({
            success:true,
            user1
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
exports.loadLists = async (req, res, next) => {
    try {
        const data = req.user.pendingList;
        
        // Map and wait for all promises to resolve
        const userList = await Promise.all(
            data.map(async (elem) => {
                const id = elem._id;
                const user1 = await user.findById(id); // Assuming "user" is a model named "User"
                return user1;
            })
        );
        
        return res.status(200).json({
            success: true,
            list: userList
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
