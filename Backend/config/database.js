const mongoose=require("mongoose");

exports.connectDB=()=>{
mongoose.connect("mongodb://127.0.0.1:27017/swapkard?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2").then((data)=>{
    console.log(`MongoDB connected to host: ${data.connection.host}`);
}).catch((err)=>{
    console.log(`Error: ${err}`);
})
}