const express=require("express");
const app=express();
const cors=require("cors");
const cookieParser=require('cookie-parser');
const bodyParser=require("body-parser");

app.use(cors({
    origin: 'http://localhost:3000', // Adjust as needed
    credentials: true
  
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
const router=require("./routes/userRoutes");

app.use("/api/v1", router);

module.exports=app;