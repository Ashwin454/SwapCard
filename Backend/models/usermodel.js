const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true,
        minLength:[8, "Enter at least 8 characters"]
    },
    job:{
        type:String,
    },
    workAt:{
        type:String
    },
    contactList:[{
        id:{
            type:mongoose.Schema.ObjectId,
        }
    }],
    avatar:{
        publicId:{
            type:String,
        },
        url:{
            type:String,
        }
    },
    age:{
        type:Number
    },
    qrcodeurl:{
        type:String
    },
    pendingList:[{
        id:{
            type:mongoose.Schema.ObjectId,
        }
    }]
})

module.exports = mongoose.model("User",userSchema );